import { Select, Option } from "@material-tailwind/react";

export function SelectWithComponents({ selectedOption, onChange }) {
  return (
    <div className="w-32">
      <Select
        className="outline border-none shadow-none"
        value={selectedOption}
        onChange={onChange}
      >
        <Option value="Revenue-Analytics">Revenue-Analytics</Option>
        <Option value="Customer-Analytics">Customer-Analytics</Option>
        <Option value="Products-Analytics">Products-Analytics</Option>
      </Select>
    </div>
  );
}
