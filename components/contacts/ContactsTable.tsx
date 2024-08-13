import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Selection,
  SortDescriptor,
  Pagination,
  Select,
  SelectItem,
  Button,
  useDisclosure,
  Tabs,
  Tab,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useTheme } from "next-themes";

import { columns } from "./data";
import ContactModal from "./ContactModal";
import FormModal from "./FormModal";

import { Contact, Form, Label } from "@/interfaces/contacts";
import { api, setAuthTokenHeader } from "@/utils/api";
import useUserStore from "@/stores/user";

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "name",
  "firstName",
  "lastName",
  "email",
  "phone",
  "address",
  "initialMessage",
  "hasReadInitialMessage",
  "createdAt",
  "agreedToPrivacyPolicy",
  "agreedToNewsLetter",
  "labels",
];

const ContactsTable: FC = () => {
  const wordColors = ["primary", "warning", "danger", "success"];
  const { theme } = useTheme();

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [forms, setForms] = useState<Form[]>([]);
  const [currentForm, setCurrentForm] = useState<string>("all");
  const [formToEdit, setFormToEdit] = useState<Form | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );

  const [perPage, setPerPage] = useState<number>(10);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "createdAt",
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [labels, setLabels] = useState<Label[]>([]);

  const onRowAction = (id: string) => {
    const contact = contacts.find((e) => e.id === id);

    if (contact) setCurrentContact(contact);
    onOpen();
  };

  const userStore = useUserStore();
  const { onOpenChange, isOpen, onOpen } = useDisclosure();
  const {
    onOpenChange: onOpenChangeForm,
    isOpen: isOpenForm,
    onOpen: onOpenForm,
  } = useDisclosure();

  const perPageItems = [
    { key: 5, label: "5" },
    { key: 10, label: "10" },
    { key: 20, label: "20" },
    { key: 50, label: "50" },
  ];

  function getPropertiesWithAllNull(objects: Contact[]): string[] {
    if (objects.length === 0) {
      return [];
    }

    const properties = Object.keys(objects[0]) as (keyof Contact)[];

    const nullProperties = properties.filter((prop) => {
      return objects.every((obj) => obj[prop] === null);
    });

    return nullProperties as string[];
  }

  const getContacts = async () => {
    try {
      await getLabels();

      const { data } = await api.get<Contact[]>(
        `contacts/get-contacts/${userStore.user?.id}`,
      );

      setContacts(data || []);

      const filteredColumns = INITIAL_VISIBLE_COLUMNS.filter(
        (e) =>
          ![
            "id",
            "initialMessage",
            "agreedToPrivacyPolicy",
            ...getPropertiesWithAllNull(data),
          ].includes(e),
      );

      setVisibleColumns(new Set(filteredColumns));
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const getLabels = async () => {
    try {
      userStore.token?.authToken &&
        setAuthTokenHeader(userStore.token?.authToken);
      const { data, status } = await api.get(
        `contacts/labels/${userStore.user?.id}`,
      );

      setLabels(status === 404 ? [] : data);
    } catch (error: any) {
      error.response.status !== 404 && toast.error(`${error}`);
    }
  };

  const getForms = async () => {
    try {
      userStore.token?.authToken &&
        setAuthTokenHeader(userStore.token?.authToken);
      const { data } = await api.get<Form[]>(
        `contacts/forms/${userStore.user?.id}`,
      );

      setForms(data);
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  useEffect(() => {
    getContacts();
    getForms();
  }, []);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from([
        ...visibleColumns,
        "createdAt",
        "hasReadInitialMessage",
        "labels",
      ]).includes(column.uid),
    );
  }, [visibleColumns]);

  const sortedItems = useMemo(() => {
    return [...contacts].sort((a: Contact, b: Contact) => {
      const first = a[sortDescriptor.column as keyof Contact] as
        | number
        | string;
      const second = b[sortDescriptor.column as keyof Contact] as
        | number
        | string;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, contacts]);

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;

    return sortedItems.slice(startIndex, endIndex);
  }, [currentPage, perPage, sortedItems]);

  const renderCell = useCallback(
    (contact: Contact, columnKey: React.Key) => {
      const cellValue = contact[columnKey as keyof Contact];

      switch (columnKey) {
        case "hasReadInitialMessage":
          return (
            <Chip
              className="capitalize"
              color={
                contact[columnKey as keyof Contact] ? "primary" : "success"
              }
              size="sm"
              variant="flat"
            >
              {contact[columnKey as keyof Contact] ? "Seen" : "New contact"}
            </Chip>
          );
        case "agreedToNewsLetter":
          return (
            <Chip
              className="capitalize"
              color={contact[columnKey as keyof Contact] ? "success" : "danger"}
              size="sm"
              variant="flat"
            >
              {contact[columnKey as keyof Contact] ? "Yes" : "No"}
            </Chip>
          );
        case "createdAt":
          return dayjs(contact.createdAt).format("DD. MM. YYYY HH:mm");
        case "labels":
          return labels
            .filter((e) => contact.labels.includes(e.id))
            .map((l) => (
              <div key={l.id} className="flex flex-col items-center">
                {wordColors.includes(l.color) ? (
                  <Chip
                    className="mb-1"
                    // @ts-ignore
                    color={l.color}
                    size="sm"
                    variant="flat"
                  >
                    {l.title}
                  </Chip>
                ) : (
                  <Chip
                    className="mb-1"
                    classNames={{
                      base: `bg-${l.color}-${theme === "dark" ? "900" : "300"}`,
                      content: `text-${l.color}-${
                        theme === "dark" ? "300" : "500"
                      }`,
                    }}
                    size="sm"
                    variant="flat"
                  >
                    {l.title}
                  </Chip>
                )}
              </div>
            ));
        default:
          return cellValue;
      }
    },
    [labels, theme],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [contacts, perPage]);

  useEffect(() => {
    const form = forms.find((e) => e.id === currentForm);

    if (!form) {
      const filteredColumns = INITIAL_VISIBLE_COLUMNS.filter(
        (e) =>
          ![
            "id",
            "initialMessage",
            "agreedToPrivacyPolicy",
            ...getPropertiesWithAllNull(contacts),
          ].includes(e),
      );

      setVisibleColumns(new Set(filteredColumns));

      return;
    }
    const filteredColumns = form?.formProperties.filter(
      (e) =>
        ![
          "id",
          "initialMessage",
          "agreedToPrivacyPolicy",
          ...getPropertiesWithAllNull(contacts),
        ].includes(e),
    );

    setVisibleColumns(new Set(filteredColumns));
  }, [currentForm]);

  const startEdit = (form: Form) => {
    setFormToEdit(form);
    onOpenForm();
  };

  const addForm = () => {
    setFormToEdit(null);
    onOpenForm();
  };

  const copyEmails = () => {
    let selectedContactIds: string[] = [];

    if (selectedKeys === "all") {
      selectedContactIds = contacts.map((contact) => contact.id);
    } else {
      selectedContactIds = Array.isArray(selectedKeys)
        ? selectedKeys.map((key) => key.toString())
        : Array.from(selectedKeys).map((key) => key.toString());
    }

    const selectedContacts = contacts.filter((contact) =>
      selectedContactIds.includes(contact.id),
    );

    const emails = selectedContacts.map((contact) => contact.email).join(", ");

    navigator.clipboard
      .writeText(emails)
      .then(() =>
        toast.success("Emailové adresy byly zkopírovány do schránky."),
      )
      .catch(() => toast.error("Nepodařilo se zkopírovat emailové adresy."));
  };

  return (
    <>
      <FormModal
        form={formToEdit}
        isOpen={isOpenForm}
        refetch={getForms}
        onOpenChange={onOpenChangeForm}
      />
      <div className="flex gap-3 mb-3 items-center">
        <Button
          color="primary"
          endContent={<i className="mdi mdi-plus" />}
          size="lg"
          variant="shadow"
          onClick={() => addForm()}
        >
          Přidat
        </Button>

        {/* Tabs for large screens */}
        <Tabs
          className="hidden lg:block"
          color="primary"
          onSelectionChange={(e) => setCurrentForm(e as string)}
        >
          <Tab key="all" title="Všechny" />
          {forms.map((e) => (
            <Tab
              key={e.id}
              title={
                <div className="flex items-center gap-2">
                  {e.name}
                  <Button
                    isIconOnly
                    radius="full"
                    size="sm"
                    variant="light"
                    onClick={() => startEdit(e)}
                  >
                    <i className="mdi mdi-dots-vertical" />
                  </Button>
                </div>
              }
            />
          ))}
        </Tabs>

        {/* Select for small screens */}
        <Select
          className="lg:hidden"
          label="Vyberte formulář"
          selectedKeys={new Set([currentForm])}
          size="sm"
          onSelectionChange={(e) => {
            const selectedValue = Array.from(e)[0];

            setCurrentForm(selectedValue as string);
          }}
        >
          {[{ name: "Všechny", id: "all" }, ...forms].map((e) => (
            <SelectItem key={e.id} value={e.id}>
              {e.name}
            </SelectItem>
          ))}
        </Select>
      </div>

      <Table
        isHeaderSticky
        aria-label="Example table with custom cells and sorting"
        classNames={{
          wrapper: "max-h-[600px]",
        }}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        onRowAction={(id) => onRowAction(id as string)}
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align="start"
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={"No contacts found"}
          items={
            currentForm === "all"
              ? currentItems
              : currentItems.filter((e) => e.formId === currentForm)
          }
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Button
        className="mt-3"
        color="primary"
        variant="shadow"
        onClick={copyEmails}
      >
        Zkopírovat emailové adresy
      </Button>
      <div className="flex justify-between align-center mt-3 hidden">
        <Pagination
          showControls
          initialPage={1}
          page={currentPage}
          total={Math.ceil(contacts.length / perPage)}
          onChange={(page) => setCurrentPage(page)}
        />
        <Select
          className="max-w-40"
          label="Items Per Page"
          selectedKeys={new Set([perPage.toString()])}
          size="sm"
          variant="underlined"
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0];

            setPerPage(Number(value));
          }}
        >
          {perPageItems.map((i) => (
            <SelectItem key={i.key}>{i.label}</SelectItem>
          ))}
        </Select>
      </div>
      {currentContact && (
        <ContactModal
          contactId={currentContact.id}
          formProperties={
            forms.find((e) => e.id === currentContact.formId)?.formProperties ||
            []
          }
          isOpen={isOpen}
          refetch={getContacts}
          onOpenChange={onOpenChange}
        />
      )}
    </>
  );
};

export default ContactsTable;
