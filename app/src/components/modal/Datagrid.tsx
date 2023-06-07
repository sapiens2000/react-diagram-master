import * as React from 'react';
import { DataGrid, GridCellParams, GridColDef, } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import {Button,  MenuItem, Select, SelectChangeEvent } from '@mui/material';

export interface DataGridProps {
  gridRows: any;
  setGridRows: (data: any) => void;
  filteredTableCols: any;
  targetTableCols: any;
  targetMappingFields: { [key: number]: string }; 
  setTargetMappingFields: any;
  selectMappingFields: { [key: number]: string }; 
  setSelectMappingFields: any;
  selectFieldNames: string[];

}

// const RenderCheckboxCell: React.FC<GridCellParams & {
//   pk: { [key: number]: boolean },
//   setPk: React.Dispatch<React.SetStateAction<{ [key: number]: boolean }>>,
//   rowMappingValues: { [key: number]: string }
// }> = (params) => {
//   const { id, tableFieldName } = params.row;
//   const { pk, setPk, rowMappingValues } = params;

//   const checked = pk[id] || false;

//   const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const newValue = event.target.checked;
  
//     setPk((prevCheckedValues) => ({
//       ...prevCheckedValues,
//       [id]: newValue,
//     }));
  
//     setPk((prevPk) => {
//       const updatedPk = { ...prevPk };
  
//       // if (newValue) {
//       //   // Add the tableFieldName to pk
//       //   updatedPk[tableFieldName] = true;
//       // } else {
//       //   // Remove the tableFieldName from pk
//       //   delete updatedPk[tableFieldName];
//       // }
  
//       return updatedPk;
//     });
  
//     console.log(pk);
//   };

//   return (
//     <Checkbox
//       checked={checked}
//       onChange={handleCheckboxChange}
//     />
//   );
// };


const RenderDropdownCell: React.FC<GridCellParams & { tableCols: string[], rowMappingFields: { [key: number]: string }, setRowMappingFields: React.Dispatch<React.SetStateAction<{ [key: number]: string }>> }> = (
  params: GridCellParams & { tableCols: string[], rowMappingFields: { [key: number]: string }, setRowMappingFields: React.Dispatch<React.SetStateAction<{ [key: number]: string }>> }
) => {
  const [table, setTable] = useState<string>('');
  const { tableCols, rowMappingFields, setRowMappingFields } = params;

  const handleDropdownChange = (event: SelectChangeEvent<string>) => {
    const newValue = event.target.value as string;
    const rowId = params.row.id as number;

    setTable(newValue);
    setRowMappingFields((prevMappingValues) => ({
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


export default function CustomDataGrid(props: DataGridProps) {
  const [gridRows, setGridRows] = useState([]);
  const [selectFieldNames, setSelectFieldNames] = useState([]);
  
  useEffect(() => {
    setGridRows(props.gridRows);
    setSelectFieldNames(props.selectFieldNames);
  }, []);

  useEffect(() => {
    setGridRows(props.gridRows);
  }, [props.gridRows]);

  const handleRowEdit = (newRow: any, oldRow: any) => {
    const { id } = newRow;
    // console.log(newRow);
  
    const updatedRows = gridRows.map((row: { id: any; }) => {
      if (row.id === newRow.id) {
        return { ...row, ...newRow };
      }
      return row;
    });
    console.log(updatedRows)
    setGridRows(updatedRows);
    props.setGridRows(updatedRows);
  };

  const columns: GridColDef[] = [
    { 
      field: 'tableFieldName', 
      headerName: '필터된 테이블 필드', 
      width: 220, 
      // renderCell: (params) => <RenderDropdownCell {...params}
      // tableCols={props.selectFieldNames}
      // rowMappingFields={props.rowMappingFields}
      // setRowMappingFields={props.setRowMappingFields} />
    },
    {
      field: 'mappingField',
      headerName: '매핑 필드',
      width: 220,
      renderCell: (params) => <RenderDropdownCell {...params} 
      tableCols={props.targetTableCols} 
      rowMappingFields={props.targetMappingFields}
      setRowMappingFields={props.setTargetMappingFields} />
    },
    {
      field: 'defaultValue',
      headerName: '기본값',
      width: 200,
      editable: true,
    },
    // {
    //   field: 'pk',
    //   headerName: 'PK',
    //   width: 70,
    //   renderCell: (params) => <RenderCheckboxCell 
    //   {...params}
    //   rowMappingValues={props.rowMappingValues} 
    //   pk={props.pk}
    //   setPk={props.setPk}/>
    // },
  ];

  const handleAddRow = () => {
    const newRow = { id: gridRows.length + 1, tableFieldName: '', mappingField: '', defaultValue: '' };
    setGridRows((prevRows) => [...prevRows, newRow]);
    props.setGridRows((prevRows: any) => [...prevRows, newRow]);

  };

  const handleDeleteRow = () => {

    if (gridRows.length === 0) return; 
    
    const updatedRows = [...gridRows];

    //remove last data
    updatedRows.pop(); 
    setGridRows(updatedRows);
    props.setGridRows(updatedRows);
  };

  const handleRowUpdateError= () => {

  }

  return (
    <>
      <div style={{display: 'flex'}}>
        <AddRowButton handleAddRow={handleAddRow}></AddRowButton>
        <DeleteRowButton handleDeleteRow={handleDeleteRow}></DeleteRowButton>
      </div>
      <DataGrid
        rows={gridRows}
        columns={columns}
        editMode='row'
        processRowUpdate={handleRowEdit}
        onProcessRowUpdateError={handleRowUpdateError}
        // hideFooter={true}
      />
    </>
  );
}

const AddRowButton = ({handleAddRow} : any) => {
  return (
    <Button variant="contained" onClick={handleAddRow}>
      추가
    </Button>
  );
};

const DeleteRowButton = ({handleDeleteRow} : any) => {
  return (
    <Button variant="outlined" onClick={handleDeleteRow}>
      삭제
    </Button>
  );
};
