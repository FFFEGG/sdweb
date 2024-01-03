import React, { useState } from 'react';

const PermissionAllocation = ({ permissions, onSave }) => {
  const [selectedPermissions, setSelectedPermissions] = useState(permissions);

  const handlePermissionChange = (permission) => {
    const index = selectedPermissions.indexOf(permission);
    if (index === -1) {
      setSelectedPermissions([...selectedPermissions, permission]);
    } else {
      setSelectedPermissions([
        ...selectedPermissions.slice(0, index),
        ...selectedPermissions.slice(index + 1),
      ]);
    }
  };

  const handleSave = () => {
    onSave(selectedPermissions);
  };

  return (
    <div>
      <h2>Permission Allocation</h2>
      <ul>
        {permissions.map((permission) => (
          <li key={permission.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedPermissions.includes(permission)}
                onChange={() => handlePermissionChange(permission)}
              />
              {permission}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default PermissionAllocation;