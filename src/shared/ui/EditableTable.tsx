import React, { useEffect, useState } from 'react'
import Select from 'react-select'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui-shad-cn/ui/table'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  lossReasonOptions: { label: string; value: string }[]
  stageOptions: { label: string; value: string }[]
  updateData: (newData: TData[]) => void
}

export function EditableTable<TData>({
  columns,
  data,
  lossReasonOptions,
  stageOptions,
  updateData,
}: DataTableProps<TData>) {
  const [tableData, setTableData] = useState(data)
  const [editIndex, setEditIndex] = useState<{
    columnId: keyof TData | null
    rowIndex: null | number
  }>({ columnId: null, rowIndex: null })

  useEffect(() => {
    setTableData(data)
  }, [data])

  const updateRowData = (rowIndex: number, columnId: keyof TData, value: string) => {
    const updatedData = tableData.map((row, index) => {
      if (index === rowIndex) {
        return { ...row, [columnId]: value }
      }

      return row
    })

    setTableData(updatedData)
    updateData(updatedData)
  }

  const handleKeyDown = (e: React.KeyboardEvent, rowIndex: number, columnId: keyof TData) => {
    if (e.key === 'Enter') {
      setEditIndex({ columnId: null, rowIndex: null })
    }
  }

  const table = useReactTable({
    columns,
    data: tableData,
    getCoreRowModel: getCoreRowModel(),
  })

  const renderCellContent = (cell: any, rowIndex: number) => {
    const { id } = cell.column
    const value = cell.getValue()

    if (id === 'stage') {
      return (
        <Select
          menuPortalTarget={document.body}
          onChange={selectedOption =>
            updateRowData(rowIndex, id as keyof TData, selectedOption!.value)
          }
          options={stageOptions}
          styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
          value={stageOptions.find(option => option.value === value)}
        />
      )
    } else if (id === 'lossReason') {
      return (
        <Select
          menuPortalTarget={document.body}
          onChange={selectedOption =>
            updateRowData(rowIndex, id as keyof TData, selectedOption!.value)
          }
          options={lossReasonOptions}
          styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
          value={lossReasonOptions.find(option => option.value === value)}
        />
      )
    } else {
      return (
        <div
          className={'relative w-[100px] h-full '}
          onClick={() => setEditIndex({ columnId: id, rowIndex })}
        >
          {editIndex.rowIndex === rowIndex && editIndex.columnId === id ? (
            <input
              autoFocus
              className={' inset-0 bg-green-500 w-[100%] h-full px-1 py-1 border rounded text-sm'}
              onBlur={() => setEditIndex({ columnId: null, rowIndex: null })}
              onChange={e => updateRowData(rowIndex, id as keyof TData, e.target.value)}
              onKeyDown={e => handleKeyDown(e, rowIndex, id as keyof TData)}
              type={'text'}
              value={value}
            />
          ) : (
            <span className={'block w-full h-full px-2 py-1 text-sm'}>{value}</span>
          )}
        </div>
      )
    }
  }

  return (
    <div className={'rounded-md w-[90%]  border'}>
      <Table className={'border-collapse w-full'}>
        <TableHeader className={'bg-gray-200'}>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow className={'border-b border-black'} key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead className={'border-r border-black p-2'} key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow
                className={'border-b border-black'}
                data-state={row.getIsSelected() && 'selected'}
                key={row.id}
              >
                {row.getVisibleCells().map(cell => (
                  <TableCell className={'border-r border-black p-2'} key={cell.id}>
                    {renderCellContent(cell, row.index)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className={'border-b border-black'}>
              <TableCell
                className={'h-24 text-center border-r border-black p-2'}
                colSpan={columns.length}
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
