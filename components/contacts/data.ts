export const columns = [
  { name: "STATUS", uid: "hasReadInitialMessage" },
  { name: "ID", uid: "id", sortable: true },
  { name: "JMÉNO", uid: "name", sortable: true },
  { name: "FIRST NAME", uid: "firstName", sortable: true },
  { name: "MIDDLE NAME", uid: "middleName", sortable: true },
  { name: "LAST NAME", uid: "lastName", sortable: true },
  { name: "COMPANY NAME", uid: "companyName", sortable: true },
  { name: "JOB", uid: "job", sortable: true },
  { name: "COUNTRY", uid: "country", sortable: true },
  { name: "STATE", uid: "state", sortable: true },
  { name: "CITY", uid: "city", sortable: true },
  { name: "POSTAL CODE", uid: "postalCode", sortable: true },
  {
    name: "PREFERRED CONTACT METHOD",
    uid: "prefferedContactMethod",
    sortable: true,
  },
  {
    name: "PREFERRED CONTACT TIME",
    uid: "prefferedContactTime",
    sortable: true,
  },
  { name: "SECONDARY EMAIL", uid: "secondaryEmail", sortable: true },
  { name: "SECONDARY PHONE", uid: "secondaryPhone", sortable: true },
  { name: "REFERRAL SOURCE", uid: "referralSource", sortable: true },
  { name: "NOTES", uid: "notes", sortable: true },
  { name: "EMAIL", uid: "email", sortable: true },
  { name: "PHONE", uid: "phone", sortable: true },
  { name: "ADDRESS", uid: "address", sortable: true },
  { name: "INITIAL MESSAGE", uid: "initialMessage" },
  { name: "CREATED AT", uid: "createdAt", sortable: true },
  { name: "PRIVACY POLICY", uid: "agreedToPrivacyPolicy" },
  { name: "NEWS LETTER", uid: "agreedToNewsLetter" },
  { name: "LABELS", uid: "labels" },
];

interface Color {
  title: string;
  value: string;
}

export const colors: Color[] = [
  {
    title: "Primary",
    value: "primary",
  },
  {
    title: "Danger",
    value: "danger",
  },
  {
    title: "Warning",
    value: "warning",
  },
  {
    title: "Success",
    value: "success",
  },
  {
    title: "Blue",
    value: "blue",
  },
  {
    title: "Purple",
    value: "purple",
  },
  {
    title: "Green",
    value: "green",
  },
  {
    title: "Red",
    value: "red",
  },
  {
    title: "Pink",
    value: "pink",
  },
  {
    title: "Yellow",
    value: "yellow",
  },
  {
    title: "Cyan",
    value: "cyan",
  },
  {
    title: "Zinc",
    value: "zinc",
  },
];
