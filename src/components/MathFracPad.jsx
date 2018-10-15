import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import { toJS, action } from "mobx";
import { withStyles } from '@material-ui/core/styles';
import SketchPad from './SketchPad';
import ParamsGrid from './ParamsGrid';
import { TOOL_PENCIL, TOOL_LINE, TOOL_RECTANGLE, TOOL_ELLIPSE } from './SketchPadTools';
import { Select, FormControl, FormControlLabel, Checkbox, InputLabel, MenuItem, Button, IconButton, Grid, Typography, Tooltip } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import ZoomIn from '@material-ui/icons/ZoomIn';
import ZoomOut from '@material-ui/icons/ZoomOut';
import FwdIcon from '@material-ui/icons/ArrowForwardIos';
import BackIcon from '@material-ui/icons/ArrowBackIos';
import RectIcon from '@material-ui/icons/Crop32';
import CircleIcon from '@material-ui/icons/PanoramaFishEye';

import ReactDataGrid from 'react-data-grid';

const styles = theme => ({
  root: {
    flexGrow: 1,
    overflow: 'hidden',
    touchAction: 'none'
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  }
});

@inject('store')
@withStyles('styles')
@observer // must be last decorator 
export default class MathFracPad extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tool:TOOL_PENCIL,
      size: 10,
      color: '#000000',
      fill: true,
      fillColor: '#444444',
      items: [],
      showCoordinatesLeft: false,
      showCoordinatesRight: false,
      useColors: false
    }
    this.colors = [
      [0, 0, 0],
      [255, 0, 0],
      [0, 255, 0],
      [0, 0, 255],
      [255, 255, 0],
      [0, 255, 255],
      [128, 0, 128],
      [0, 128, 128],
      [128, 128, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
  }

  clear(reset) {
    const src = this.refs.sketchpad.canvas;
    const dst = this.refs.img;
    const sctx = src.getContext('2d');
    const dctx = dst.getContext('2d');
    const w = this.props.width;
    const h = this.props.height;
    sctx.clearRect(0, 0, w, h);
    dctx.clearRect(0, 0, w, h);
    if (reset) {
      this.props.store.app.clear();
    } else {
      this.forceUpdate();
    }
  }

  drawL() {
    const src = this.refs.sketchpad.canvas;
    const sctx = src.getContext('2d');
    const w = this.props.width;
    const h = this.props.height;
    sctx.clearRect(0, 0, w, h);
    sctx.fillRect(10, 10, 50, h-2*10);
    sctx.fillRect(10, h-10-50, w-2*10, 50);
    sctx.fillRect(w-50-10, 10, 50, 50);
  }

  componentDidMount() {
    this.drawL();
  }
  componentDidUpdate() {
    // toJS is essential for performance
    const left = toJS(this.props.store.app.left);
    const right = toJS(this.props.store.app.right);
    const params = toJS(this.props.store.app.params);
    const step = this.props.store.app.step;
    const w = this.props.width;
    const h = this.props.height;
    const src = this.refs.sketchpad.canvas;
    const dst = this.refs.img;
    const sctx = src.getContext('2d');
    const dctx = dst.getContext('2d');
    const useColors = this.state.showColors;
    let idx, img, orig;
    for (var j = 0; j < params.length; j++) {
      let p = params[j];
      p.r = parseFloat(p.r);
      p.s = parseFloat(p.s);
      p.e = parseFloat(p.e);
      p.f = parseFloat(p.f);
      let rad = parseFloat(p.th) * 3.14159265359 / 180.0;
      p.sin = Math.sin(rad);
      p.cos = Math.cos(rad);
    }
    if (step == 0) {
      dctx.clearRect(0, 0, w, h);
    }
    for (var s = 0; s < step; s++) {
      if (s == 0) {
        img = sctx.getImageData(0, 0, w, h);
        orig = left;
      } else {
        img = dctx.getImageData(0, 0, w, h);
        orig = right;
      }
      var pix = dctx.createImageData(w, h);

      if (s == step -1 && this.state.showCoordinatesRight) {
        let mapcol = Math.round(w * (0 - right.xmin) / (right.xmax - right.xmin));
        let maprow = h - Math.round(h * (0 - right.ymin) / (right.ymax - right.ymin)) - 1;
        // Vertical axis
        if (mapcol > 0 && mapcol < w) {
          for (var i = 0; i < h; i++) {
            idx = 4 * (w * maprow + i);
            pix.data[idx + 0] = 33;
            pix.data[idx + 1] = 33;
            pix.data[idx + 2] = 33;
            pix.data[idx + 3] = 255;
          }
        }
        // Horizontal axis
        if (maprow > 0 && maprow < h) {
          for (var i = 0; i < w; i++) {
            idx = 4 * (w * i + mapcol);
            pix.data[idx + 0] = 33;
            pix.data[idx + 1] = 33;
            pix.data[idx + 2] = 33;
            pix.data[idx + 3] = 255;
          }
        }
      }
      //let x = orig.xmin;
      //let y = orig.ymax;
      //let xincr = (orig.xmax - orig.xmin) / w;
      //let yincr = (orig.ymax - orig.ymin) / h;
      //let col = 0;
      for (var i = 0; i < img.data.length; i += 4) {
        if (img.data[i + 3] > 0) {
          idx = i / 4;
          let row = h - Math.floor(idx / w) - 1; // bottom to top
          let col = idx % w;
          let x = orig.xmin + (col / w) * (orig.xmax - orig.xmin);
          let y = orig.ymin + (row / h) * (orig.ymax - orig.ymin);
          //console.log(idx, row, col, x, y);
          for (var j = 0; j < params.length; j++) {
            let p = params[j];
            let mapx = (p.r * x * p.cos - p.s * y * p.sin + p.e);
            let mapy = (p.r * x * p.sin + p.s * y * p.cos + p.f);
            if (mapx >= right.xmin && mapx < right.xmax && mapy >= right.ymin && mapy < right.ymax) {
              var mapcol = Math.round(w * (mapx - right.xmin) / (right.xmax - right.xmin));
              var maprow = h - Math.round(h * (mapy - right.ymin) / (right.ymax - right.ymin)) - 1;
              idx = 4 * (w * maprow + mapcol);
              //console.log("j="+j + "  i="+i+" x="+x+" y="+y+ " x'="+mapx+" y'="+mapy + " => "+maprow+","+mapcol);
              //var idx = 4 * (this.w * (this.h - Math.floor(this.h * mapy) - 1) + Math.floor(this.w * mapx));
              //console.log(" => " + idx);
              if (useColors) {
                pix.data[idx + 0] = this.colors[j][0];
                pix.data[idx + 1] = this.colors[j][1];
                pix.data[idx + 2] = this.colors[j][2];
              }
              pix.data[idx + 3] = 255;
            }
          }
        }
        //x += xincr;
        //col += 1;
        //if (col == w) {
        //  y -= yincr;
        //  x = left.xmin;
        //  col = 0;
        //}
      }
      dctx.putImageData(pix, 0, 0);
    }
  }
  render() {
    const { 
      tool, size, color, fill, fillColor, items, 
      showCoordinatesLeft, showCoordinatesRight, showColors
    } = this.state;
    const app = this.props.store.app;
    const params = toJS(app.params); // have to observe here
    const left = toJS(app.left);
    const right = toJS(app.right);
    const { classes } = this.props;
    return (
      <Grid container justify="center" spacing={16} className={classes.root}>
        <Grid item xs={12}>
          <Grid container justify="center">
            <Grid item xs={5}>
              <div style={{textAlign:'center'}}>
                <SketchPad
                  ref="sketchpad"
                  width={this.props.width}
                  height={this.props.height}
                  animate={true}
                  size={size}
                  color={color}
                  fillColor={fill ? fillColor : ''}
                  items={items}
                  tool={tool} />
              </div>
              <div style={{textAlign:'center'}}>
                <Typography variant="caption">
                  x: [{left.xmin} - {left.xmax}] y: [{left.ymin} - {left.ymax}]
                </Typography>
              </div>
              <div style={{textAlign:'center'}}>
                <Tooltip title="Use L' image">
                  <IconButton width={20} onClick={()=>this.drawL()}>
                    L'
                  </IconButton>
                </Tooltip>
                <Tooltip title="Clear drawing">
                  <Button onClick={() => this.clear(false)}>
                    <ClearIcon />
                  </Button>
                </Tooltip>
                <Tooltip title="Draw freehand">
                  <IconButton color={tool==TOOL_PENCIL?'primary':'secondary'} onClick={()=>this.setState({tool:TOOL_PENCIL})}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Draw rectangles">
                  <IconButton color={tool==TOOL_RECTANGLE?'primary':'secondary'} onClick={()=>this.setState({tool:TOOL_RECTANGLE})}>
                    <RectIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Draw ellipses">
                  <IconButton color={tool==TOOL_ELLIPSE?'primary':'secondary'} onClick={()=>this.setState({tool:TOOL_ELLIPSE})}>
                    <CircleIcon />
                  </IconButton>
                </Tooltip>

                <IconButton>
                  
                </IconButton>
                <IconButton onClick={()=>app.zoomInLeft()}>
                  <ZoomIn />
                </IconButton>
                <IconButton onClick={()=>app.zoomOutLeft()}>
                  <ZoomOut />
                </IconButton>
                <Tooltip title="Show axes">
                  <FormControlLabel control={<Checkbox checked={showCoordinatesLeft} onChange={()=>this.setState({ showCoordinatesLeft: !showCoordinatesLeft })} />}
                    label="Axes:" labelPlacement="start" />
                </Tooltip>
              </div>
            </Grid>
            <Grid item xs={2}>
              <div style={{textAlign:'center',marginBottom:16}}>
                <Tooltip title="Iterate one step">
                  <Button variant="fab" color="primary" onClick={()=>this.props.store.app.forward()}>
                    <FwdIcon />
                  </Button>
                </Tooltip>
              </div>
              <div style={{textAlign:'center',marginBottom:16}}>
                <Tooltip title="Go one step back">
                  <Button variant="fab" color="primary" onClick={()=>this.props.store.app.back()}>
                    <BackIcon />
                  </Button>
                </Tooltip>
              </div>
              <div style={{textAlign:'center',marginBottom:32}}>
                <Tooltip title="Clear all and start over">
                  <Button variant="fab" color="secondary" onClick={() => this.clear(true)}>
                    <ClearIcon />
                  </Button>
                </Tooltip>
              </div>
              <div  style={{textAlign:'center'}}>
                <Typography variant="body2" className={classes.typography}>Step {app.step}</Typography>
              </div>
            </Grid>
            <Grid item xs={5}>
              <div style={{textAlign:'center'}}>
                <canvas className="canvas" style={{backgroundColor:'white'}} ref="img" width={this.props.width} height={this.props.height}></canvas>
              </div>
              <div style={{textAlign:'center'}}>
                <Typography variant="caption" className={classes.typography}>
                  x: [{right.xmin} - {right.xmax}] y: [{right.ymin} - {right.ymax}]
                </Typography>
              </div>
              <div style={{textAlign:'center'}}>
                <IconButton onClick={()=>app.zoomInRight()}>
                  <ZoomIn />
                </IconButton>
                <IconButton onClick={()=>app.zoomOutRight()}>
                  <ZoomOut />
                </IconButton>
                <Tooltip title="Show axes">
                  <FormControlLabel control={<Checkbox checked={showCoordinatesRight} onChange={()=>this.setState({ showCoordinatesRight: !showCoordinatesRight })} />}
                    label="Axes:" labelPlacement="start" />
                </Tooltip>
                <Tooltip title="Use different colors for every transform">
                  <FormControlLabel control={<Checkbox checked={showColors} onChange={()=>this.setState({ showColors: !showColors })} />}
                    label="Colors:" labelPlacement="start" />
                </Tooltip>
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <div style={{ textAlign:'center'}}>
            <form>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="paramset">Parameters</InputLabel>
                <Select value={app.name}
                  onChange={(e)=>{ app.setParams(e.target.value) }}
                  >
                  { app.paramsets.map(name => (
                      <MenuItem value={name}>{name}</MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </form>
            <ParamsGrid minHeight={250}/>
          </div>
        </Grid>
      </Grid>
    );
  }
}
/*
              <div className="options" style={{marginBottom:20}}>
                <label htmlFor="">size: </label>
                <input min="1" max="20" type="range" value={size} onChange={(e) => this.setState({size: parseInt(e.target.value)})} />
              </div>
              <div className="options" style={{marginBottom:20}}>
                <label htmlFor="">color: </label>
                <input type="color" value={color} onChange={(e) => this.setState({color: e.target.value})} />
              </div>
              {(this.state.tool == TOOL_ELLIPSE || this.state.tool == TOOL_RECTANGLE) ?
                <div>
                  <label htmlFor="">fill in:</label>
                  <input type="checkbox" value={fill} style={{margin:'0 8'}}
                         onChange={(e) => this.setState({fill: e.target.checked})} />
                  {fill ? <span>
                      <label htmlFor="">with color:</label>
                      <input type="color" value={fillColor} onChange={(e) => this.setState({fillColor: e.target.value})} />
                    </span> : ''}
                </div> : ''}
*/