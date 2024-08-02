import React, { useRef, useState } from "react";
import { Input, Button } from "@nextui-org/react";

const MyForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form data submitted:", formData);

    // Resetting form values
    setFormData({
      name: "",
      email: "",
    });
  };

  const dropdownRef = useRef<HTMLInputElement | null>(null);

  return (
    <form onSubmit={handleSubmit}>
      <Input
        ref={dropdownRef}
        required
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <Input
        required
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default MyForm;
