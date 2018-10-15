import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import { toJS } from "mobx";
//import { withStyles } from '@material-ui/core/styles';
import ReactDataGrid from 'react-data-grid';

//const styles = theme => ({
//  root: {
//    flexGrow: 1,
//  }
//});

@inject('store')
//@withStyles('styles')
@observer // must be last decorator 
export default class ParamsGrid extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      { key:'r', name:'ScaleX', width: 100, editable:true },
      { key:'s', name:'ScaleY', width: 100, editable:true },
      { key:'th', name:'Rotate', width: 100, editable:true },
      { key:'e', name:'TransX', width: 100, editable:true },
      { key:'f', name:'TransY', width: 100, editable:true }
    ];
  }
  rowGetter = (i) => {
    return this.props.store.app.params[i];
  };
  handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    let p = toJS(this.props.store.app.params);
    for (let i = fromRow; i <= toRow; i++) {
      for (var k in updated) {
        p[i][k] = updated[k];
      }
    }
    this.props.store.app.set(p);
  };
  render() {
    //const { classes } = this.props;
    // minHeight={this.props.minHeight}
    const params = this.props.store.app.params; 
    return (
      <ReactDataGrid
        enableCellSelect={true}
        columns={this.columns}
        rowGetter={this.rowGetter}
        rowsCount={params.length}
        onGridRowsUpdated={this.handleGridRowsUpdated}
        minWidth={515}  />
    );
  }
}
