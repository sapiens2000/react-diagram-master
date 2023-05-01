import * as React from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridValueGetterParams } from '@mui/x-data-grid';


export interface DataGridProps {
  rows: any;
  setCurRows: (data: any) => void;
}

const columns: GridColDef[] = [
    { 
      field: 'tableFieldName', 
      headerName: '테이블 필드명', 
      width: 220, 
      editable: false 
    },
    { 
      field: 'type', 
      headerName: '유형', 
      editable: true 
    },
    {
      field: 'mappingField',
      headerName: '매핑 필드',
      width: 220,
      editable: true,
    },
    {
      field: 'defaultValue',
      headerName: '기본값',
      width: 200,
      editable: true,
    },
  ];

export default function EditableDataGrid(props: DataGridProps) {

  const handleCellEdit = (params: any) => {
    const rowsCopy = [...props.rows];
    const rowToUpdate = rowsCopy.find((row) => row.id === params.id);
    const updatedRow = { ...rowToUpdate, [params.field]: params.value };
    const updatedRows = props.rows.map((row: { id: number; }) => row.id === params.id ? updatedRow : row);

    //console.log(params.value)
    console.log(updatedRows)
    // if (JSON.stringify(rowToUpdate) !== JSON.stringify(updatedRow)) {
    //   rowsCopy[index] = updatedRow;
    //   console.log(rowsCopy)
    //   props.setCurRows(updatedRow);
    // }

    // const updatedRow = { ...props.rows[params.id], [params.field]: params.value };
    // const updatedRows = [...props.rows];
    // updatedRows[params.id] = updatedRow;
    // console.log(updatedRows)
    //props.setCurRows(updatedRows);
  }


  const handleRowEdit = (params: any) => {
    console.log(params)
    const rowsCopy = [...props.rows];
    const rowToUpdate = rowsCopy.find((row) => row.id === params.id);

    const updatedRow = { ...rowToUpdate, [params.field]: params.value };

    const updatedRows = props.rows.map((row: { id: number }) => {
      if (row.id == params.id) {
        return { ...row, [params.field]: params.value };
      }
      return row;
    });
    
    console.log(updatedRows);
    // const updatedRows = props.rows.map((row: { id: number }) =>
    //   row.id == params.id ? updatedRow : row
    // );
  }
  return (
      <DataGrid
        rows={props.rows}
        columns={columns}
        editMode='row'
        //onRowEditStop={handleRowEdit}
        processRowUpdate={handleRowEdit}
        onProcessRowUpdateError={() => {console.log('update error')}}
      />
  );
}