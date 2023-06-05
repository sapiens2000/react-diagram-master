import * as React from 'react';
import { DataGrid, GridCellParams, GridColDef, GridEditRowProps, GridRowParams, GridRowsProp, GridValueGetterParams, MuiBaseEvent, MuiEvent } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Box, Checkbox, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

export interface DataGridProps {
  gridRows: any;
  setGridRows: (data: any) => void;
  tableCols: any;
  rowMappingValues: { [key: number]: string }; 
  setRowMappingValues: any;
  pk: {},
  setPk: any;
}

const RenderCheckboxCell: React.FC<GridCellParams & {
  pk: { [key: number]: boolean },
  setPk: React.Dispatch<React.SetStateAction<{ [key: number]: boolean }>>,
  rowMappingValues: { [key: number]: string }
}> = (params) => {
  const { id, tableFieldName } = params.row;
  const { pk, setPk, rowMappingValues } = params;

  const checked = pk[id] || false;

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
  
    setPk((prevCheckedValues) => ({
      ...prevCheckedValues,
      [id]: newValue,
    }));
  
    setPk((prevPk) => {
      const updatedPk = { ...prevPk };
  
      // if (newValue) {
      //   // Add the tableFieldName to pk
      //   updatedPk[tableFieldName] = true;
      // } else {
      //   // Remove the tableFieldName from pk
      //   delete updatedPk[tableFieldName];
      // }
  
      return updatedPk;
    });
  
    console.log(pk);
  };

  return (
    <Checkbox
      checked={checked}
      onChange={handleCheckboxChange}
    />
  );
};


const RenderDropdownCell: React.FC<GridCellParams & { tableCols: string[], rowMappingValues: { [key: number]: string }, setRowMappingValues: React.Dispatch<React.SetStateAction<{ [key: number]: string }>> }> = (
  params: GridCellParams & { tableCols: string[], rowMappingValues: { [key: number]: string }, setRowMappingValues: React.Dispatch<React.SetStateAction<{ [key: number]: string }>> }
) => {
  const [table, setTable] = useState<string>('');
  const { tableCols, rowMappingValues, setRowMappingValues } = params;

  const handleDropdownChange = (event: SelectChangeEvent<string>) => {
    const newValue = event.target.value as string;
    const rowId = params.row.id as number;

    setTable(newValue);
    setRowMappingValues((prevMappingValues) => ({
      ...prevMappingValues,
      [params.row.id as number]: newValue,
    }));

  };

  useEffect(() => {
    setTable(params.value as string);
  }, []);


  return (
    <Select
      value={table}
      onChange={handleDropdownChange}
      style={{ width: '100%' }}
    >
      {tableCols.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  );
};


export default function InsertDataGrid(props: DataGridProps) {
  const [rows, setRows] = useState({...props.gridRows});
  
  const handleRowEdit = (newRow: any, oldRow: any) => {
    const { id } = newRow;
    // console.log(newRow);
  
    const updatedRows = rows.map((row: { id: any; }) => {
      if (row.id === newRow.id) {
        return { ...row, ...newRow };
      }
      return row;
    });
    console.log(updatedRows)
    setRows(updatedRows);
    props.setGridRows(updatedRows);
  };

  const insert_columns: GridColDef[] = [
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
      renderCell: (params) => <RenderDropdownCell {...params} 
      tableCols={props.tableCols} 
      rowMappingValues={props.rowMappingValues}
      setRowMappingValues={props.setRowMappingValues} />
    },
    {
      field: 'defaultValue',
      headerName: '기본값',
      width: 200,
      editable: true,
    },
    {
      field: 'pk',
      headerName: 'PK',
      width: 70,
      renderCell: (params) => <RenderCheckboxCell 
      {...params}
      rowMappingValues={props.rowMappingValues} 
      pk={props.pk}
      setPk={props.setPk}/>
    },
  ];

  const handleRowUpdateError= () => {
    console.log('update error');
  }

  return (
      <DataGrid
        rows={props.gridRows}
        columns={insert_columns}
        editMode='row'
        processRowUpdate={handleRowEdit}
        onProcessRowUpdateError={handleRowUpdateError}
        hideFooter={true}
      />
  );
}
