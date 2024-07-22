import React, { useState } from 'react'

interface EditableCellProps {
  onChange: (value: string) => void
  type?: 'date' | 'number' | 'text'
  value: number | string
}

const EditableCell: React.FC<EditableCellProps> = ({ onChange, type = 'text', value }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)

  const handleDoubleClick = () => setIsEditing(true)

  const handleBlur = () => {
    setIsEditing(false)
    onChange(editValue.toString())
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value)
  }

  return isEditing ? (
    <input
      autoFocus
      className={'border p-2 w-full'}
      onBlur={handleBlur}
      onChange={handleChange}
      type={type}
      value={editValue}
    />
  ) : (
    <span className={'block p-2'} onDoubleClick={handleDoubleClick}>
      {value}
    </span>
  )
}

export default EditableCell
