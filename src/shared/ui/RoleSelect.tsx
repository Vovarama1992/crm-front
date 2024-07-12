import React from 'react'

interface Role {
  name: string
  value: string
}

interface SelectProps {
  handleRoleChange: (selectedRole: string) => void
  roles: Role[]
}

export const RoleSelect: React.FC<SelectProps> = ({ handleRoleChange, roles }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRole = event.target.value

    handleRoleChange(selectedRole)
  }

  return (
    <select
      className={
        'block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
      }
      onChange={handleChange}
    >
      <option disabled hidden value={''}>
        Выберите роль
      </option>
      {roles.map(role => (
        <option
          className={'text-gray-900 cursor-pointer select-none relative py-2 pl-10 pr-4'}
          key={role.value}
          value={role.value}
        >
          {role.name}
        </option>
      ))}
    </select>
  )
}
