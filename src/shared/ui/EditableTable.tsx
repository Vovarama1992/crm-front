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

interface CustomColumnMeta {
  options?: { label: string; value: string }[]
  type?: 'input' | 'select'
}

export interface CustomColumnDef<TData> extends Omit<ColumnDef<TData, unknown>, 'meta'> {
  accessorKey: keyof TData
  meta?: CustomColumnMeta
}

interface DataTableProps<TData> {
  columns: CustomColumnDef<TData>[]
  data: TData[]
  selectOptions?: { [key: string]: { label: string; value: string }[] }
  updateData: (newData: TData[]) => void
  user_id: number
  userPermissions: { [key: string]: 'change' | 'create' | 'null' | 'see' }
}

export function EditableTable<TData>({
  columns,
  data,
  selectOptions,
  updateData,
  user_id,
  userPermissions,
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setEditIndex({ columnId: null, rowIndex: null })
    }
  }

  const handleAddRow = () => {
    const newRow = columns.reduce((acc, column) => {
      acc[column.accessorKey] = '' as TData[keyof TData]

      return acc
    }, {} as Partial<TData>)

    setTableData([...tableData, newRow as TData])
    updateData([...tableData, newRow as TData])
  }

  const filteredColumns = columns.filter(
    column => userPermissions[column.accessorKey as string] !== 'null'
  )

  const table = useReactTable({
    columns: filteredColumns,
    data: tableData,
    getCoreRowModel: getCoreRowModel(),
  })

  const renderCellContent = (cell: any, rowIndex: number) => {
    const { id } = cell.column
    const value = cell.getValue()
    const permission = userPermissions[id]

    const row = tableData[rowIndex] as { user_id: number }
    const isEditable = permission === 'change' || row.user_id === user_id

    if (permission === 'see' && row.user_id !== user_id) {
      return <span className={'block w-full h-full px-2 py-1 text-sm'}>{value}</span>
    }

    if (isEditable && selectOptions) {
      const columnDef = columns.find(col => col.accessorKey === id)
      const cellType = columnDef?.meta?.type
      const options = selectOptions[id]

      if (cellType === 'select' && options) {
        return (
          <Select
            menuPortalTarget={document.body}
            onChange={(selectedOption: any) =>
              updateRowData(rowIndex, id as keyof TData, selectedOption ? selectedOption.value : '')
            }
            options={options}
            styles={{
              menu: (base: any) => ({
                ...base,
                minWidth: '300px',
                width: '300px',
              }),
              menuPortal: base => ({ ...base, zIndex: 9999 }),
            }}
            value={options.find(option => option.value === value)}
          />
        )
      } else if (cellType === 'input') {
        return (
          <div
            className={'relative w-[100px] h-full cursor-pointer'}
            onClick={() => setEditIndex({ columnId: id, rowIndex })}
          >
            {editIndex.rowIndex === rowIndex && editIndex.columnId === id ? (
              <input
                autoFocus
                className={
                  'inset-0 w-[100%] h-full px-1 py-1 border border-dashed border-teal-500 bg-teal-50 rounded text-sm'
                }
                onBlur={() => setEditIndex({ columnId: null, rowIndex: null })}
                onChange={e => updateRowData(rowIndex, id as keyof TData, e.target.value)}
                onKeyDown={e => handleKeyDown(e)}
                type={'text'}
                value={value}
              />
            ) : (
              <span
                className={
                  'block w-full h-full px-2 py-1 text-sm cursor-pointer bg-teal-50 border border-dashed border-teal-500 rounded'
                }
              >
                {value}
              </span>
            )}
          </div>
        )
      }
    }

    return null
  }

  return (
    <div className={'rounded-md w-[100%] border'}>
      {userPermissions.create && (
        <button
          className={'bg-blue-500 text-white px-4 py-2 rounded mb-2 ml-[10%]'}
          onClick={handleAddRow}
        >
          Добавить запись
        </button>
      )}
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
                  <TableCell className={'border-r w-[10%] border-black p-2'} key={cell.id}>
                    {renderCellContent(cell, row.index)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className={'border-b border-black'}>
              <TableCell
                className={'h-24 text-center border-r border-black p-2'}
                colSpan={filteredColumns.length}
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
