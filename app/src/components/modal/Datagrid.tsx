import * as React from 'react';
import { DataGrid, GridCellParams, GridColDef, } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import {Button,  Checkbox,  MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { RowField } from '../node/OutputNodeModel';

export interface DataGridProps {
  gridRows: any;
  setGridRows: (data: any) => void;
  filteredTableCols: any;
  targetTableCols: any;
  targetMappingFields: any; 
  setTargetMappingFields: any;
  selectFieldNames: string[];
  pk: any;
  setPk: any;
}

const RenderCheckboxCell: React.FC<GridCellParams & {
  pk: [string, string][],
  setPk: React.Dispatch<React.SetStateAction<[string, string][]>>,
  targetMappingFields: { [key: number]: string },
}> = (params) => {
  const { id, tableFieldName } = params.row;
  const { pk, setPk, targetMappingFields } = params;

  const checked = pk.some(([field]) => field === tableFieldName);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;

    setPk((prevPk) => {
      let updatedPk = prevPk.filter(([field]) => field !== tableFieldName);

      if (newValue) {
        // Add [tableFieldName, mappingField] to pk
        updatedPk.push([tableFieldName, targetMappingFields[id]]);
      }

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

const RenderDropdownCell: React.FC<GridCellParams & { tableCols: string[], targetMappingFields: { [key: number]: string }, setTargetMappingFields: React.Dispatch<React.SetStateAction<{ [key: number]: string }>> }> = (
  params: GridCellParams & { tableCols: string[], targetMappingFields: { [key: number]: string }, setTargetMappingFields: React.Dispatch<React.SetStateAction<{ [key: number]: string }>> }
) => {
  const [selectedValue, setSelectedValue] = useState<string>('');
  const { tableCols, targetMappingFields, setTargetMappingFields, value, id } = params;

  useEffect(() => {
    setSelectedValue(params.value as string || '');
  }, [params.value]);

  useEffect(() => {
    const row = params.row as RowField;
    if (row.tableFieldName === '') {
      const mappingField = targetMappingFields[Number(id)] || '';
      setSelectedValue(mappingField !== '' ? mappingField : value as string || '');
    }
  }, [params.row, id, targetMappingFields, value]);

  const handleDropdownChange = (event: SelectChangeEvent<string>) => {
    const newValue = event.target.value as string;
    const rowId = id as number;

    setSelectedValue(newValue);
    setTargetMappingFields((prevMappingValues) => ({
      ...prevMappingValues,
      [rowId]: newValue,
    }));
  };

  return (
    <Select
      value={selectedValue}
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
    setGridRows([...props.gridRows]);
    setSelectFieldNames([...props.selectFieldNames]);
  }, []);

  useEffect(() => {
    setGridRows([...props.gridRows]);
  }, [props.gridRows]);

  const handleRowEdit = (newRow: any, oldRow: any) => {
    const { id } = newRow;
  
    const updatedRows = gridRows.map((row: { id: any }) => {
      if (row.id === newRow.id) {
        return { ...row, ...newRow };
      }
      return row;
    });

    setGridRows(updatedRows);
    props.setGridRows(updatedRows)
  };

  const columns: GridColDef[] = [
    { 
      field: 'tableFieldName', 
      headerName: '필터된 테이블 필드', 
      width: 220, 
      editable: true
      // renderCell: (params) => <RenderDropdownCell {...params}
      // tableCols={props.selectFieldNames}
      // targetMappingFields={props.targetMappingFields}
      // settargetMappingFields={props.settargetMappingFields} />
    },
    {
      field: 'mappingField',
      headerName: '매핑 필드',
      width: 220,
      renderCell: (params) => <RenderDropdownCell {...params} 
      tableCols={props.targetTableCols} 
      targetMappingFields={props.targetMappingFields}
      setTargetMappingFields={props.setTargetMappingFields} />
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
      targetMappingFields={props.targetMappingFields}
      {...params}
      pk={props.pk}
      setPk={props.setPk}/>
    },
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
    props.setGridRows([...updatedRows]);
  };


  const handleRefreshRow = () => {

    const generateGridRows = (TargetTableColNames: string[]): RowField[] => {
      return TargetTableColNames.map((fieldName, index) => {
          return {
              id: index,
              tableFieldName: fieldName,
              mappingField: '',
              defaultValue: '',
          };
      });
  };

    const refreshedRows = [...generateGridRows(selectFieldNames)]
    setGridRows(refreshedRows);
    props.setGridRows(refreshedRows);
  }

  const handleRowUpdateError= () => {

  }

  return (
    <>
      <div style={{display: 'flex'}}>
        <AddRowButton handleAddRow={handleAddRow}></AddRowButton>
        <DeleteRowButton handleDeleteRow={handleDeleteRow}></DeleteRowButton>
        <RefreshRowButton handleRefreshRow={handleRefreshRow}></RefreshRowButton>
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
    <Button variant="outlined" onClick={handleDeleteRow} color='error'>
      삭제
    </Button>
  );
};

const RefreshRowButton = ({handleRefreshRow} : any) => {
  return (
    <Button variant="outlined" onClick={handleRefreshRow}>
      초기화
    </Button>
  );
};
