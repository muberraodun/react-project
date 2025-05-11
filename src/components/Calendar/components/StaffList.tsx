import React from "react";
import type { StaffSelectProps } from "../types";

const StaffList: React.FC<StaffSelectProps> = ({
  staffs,
  selectedStaffId,
  onStaffSelect,
  staffColors,
}) => {
  return (
    <div className="staff-list">
      {staffs?.map((staff: any, index: number) => (
        <div
          key={staff.id}
          onClick={() => {
            onStaffSelect(staff.id);
          }}
          className={`staff ${staff.id === selectedStaffId ? "active" : ""}`}
          style={{
            borderColor: staff.id === selectedStaffId ? staffColors[index % staffColors.length] : undefined,
            backgroundColor: staff.id === selectedStaffId ? `${staffColors[index % staffColors.length]}10` : undefined
          }}
        >
          <div
            className="staff-avatar"
            style={{
              backgroundColor: staffColors[index % staffColors.length]
            }}
          >
            {staff.name.charAt(0).toUpperCase()}
          </div>
          <span
            className="staff-name"
            style={{
              color: staff.id === selectedStaffId ? staffColors[index % staffColors.length] : undefined
            }}
          >
            {staff.name}
          </span>
          {staff.id === selectedStaffId && (
            <div
              className="active-indicator"
              style={{
                backgroundColor: staffColors[index % staffColors.length]
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default StaffList; 