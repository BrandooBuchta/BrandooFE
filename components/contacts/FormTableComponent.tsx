import React, { FC, useEffect, useState, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Select,
  SelectItem,
  Button,
  useDisclosure,
  Tabs,
  Tab,
  Input,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import NextLink from "next/link";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import debounce from "lodash.debounce";

import NewFormModal from "../NewFormModal";

import { InputType } from "./input-types/InputTypes";
import ContactModal from "./ContactModal";

import { FormTable } from "@/interfaces/form";
import { Label } from "@/interfaces/contacts";
import { api } from "@/utils/api";
import useUserStore from "@/stores/user";

const FormTableComponent: FC = () => {
  const [formTableData, setFormTableData] = useState<FormTable | null>(null);
  const [forms, setForms] = useState<{ name: string; id: string }[]>([]);
  const [currentFormId, setCurrentFormId] = useState<string>("all");
  const [responseId, setResponseId] = useState<string | null>(null);
  const [perPage, setPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [labels, setLabels] = useState<Label[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<string>("desc");

  function fileLabel(number: number) {
    switch (number) {
      case 1:
        return `${number} Soubor`;
      case 2:
      case 3:
      case 4:
        return `${number} Soubory`;
      default:
        return `${number} Souborů`;
    }
  }

  function shortenText(text: string) {
    if (text.length > 30) {
      return text.substring(0, 30) + "...";
    }

    return text;
  }

  const userStore = useUserStore();
  const {
    onOpenChange: onOpenChangeForm,
    isOpen: isOpenForm,
    onOpen: onOpenForm,
  } = useDisclosure();
  const { onOpenChange, isOpen, onOpen } = useDisclosure();

  const perPageItems = [
    { key: 5, label: "5" },
    { key: 10, label: "10" },
    { key: 20, label: "20" },
    { key: 50, label: "50" },
  ];

  const getUsersForms = async () => {
    try {
      const { data } = await api.get<{ id: string; name: string }[]>(
        `forms/get-users-forms/${userStore.user?.id}`,
      );

      setForms(data);
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const getFormTable = async (
    page: number = 1,
    perPage: number = 10,
    query: string = "",
    sortBy: string = "created_at",
    sortOrder: string = "desc",
  ) => {
    const privateKey = Cookies.get("privateKey");

    if (!privateKey) return;

    try {
      const { data } = await api.get<FormTable>(
        currentFormId === "all"
          ? `forms/users-forms-table/${userStore.user?.id}`
          : `forms/form-table/${currentFormId}`,
        {
          headers: {
            "X-Private-Key": privateKey,
          },
          params: {
            page: page,
            per_page: perPage,
            search_query: query,
            sort_by: sortBy,
            sort_order: sortOrder,
          },
        },
      );

      setFormTableData(data);
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const getLabels = async () => {
    try {
      const { data, status } = await api.get(
        `contacts/labels/${userStore.user?.id}`,
      );

      setLabels(status === 404 ? [] : data);
    } catch (error: any) {
      error.response.status !== 404 && toast.error(`${error}`);
    }
  };

  const formatCellValue = (type: InputType, value: any) => {
    if (!value) {
      return "N/A"; // Gracefully handle missing values
    }

    switch (type) {
      case InputType.BOOLEAN:
        return value ? "Ano" : "Ne";
      case InputType.LONG_TEXT:
        return shortenText(value);
      case InputType.CHECKBOX:
        return Array.isArray(value) ? value.join(", ") : value;
      case InputType.DATETIME:
        return dayjs(value).format("DD. MM. YYYY HH:mm");
      case InputType.FILE:
        return fileLabel((value as string[]).length);
      default:
        return value;
    }
  };

  const debouncedSearch = useCallback(
    debounce((formId, query) => {
      getFormTable(currentPage, perPage, query, sortBy, sortOrder);
    }, 500), // 500ms delay
    [currentPage, perPage, sortBy, sortOrder],
  );

  useEffect(() => {
    getUsersForms();
  }, []);

  useEffect(() => {
    getFormTable(currentPage, perPage, searchQuery, sortBy, sortOrder);
  }, [currentFormId, sortBy, sortOrder]);

  const onRowAction = (resId: string) => {
    setResponseId(resId);
    onOpen();
  };

  return (
    <>
      <NewFormModal isOpen={isOpenForm} onOpenChange={onOpenChangeForm} />
      {responseId && (
        <ContactModal
          isOpen={isOpen}
          responseId={responseId}
          onOpenChange={onOpenChange}
        />
      )}
      <div className="flex mb-3 items-center justify-between">
        <div className="flex gap-3 items-center 40%]">
          <Button
            color="primary"
            endContent={<i className="mdi mdi-plus" />}
            size="lg"
            variant="shadow"
            onClick={() => onOpenForm()}
          >
            Přidat
          </Button>

          <Tabs
            className="hidden lg:block"
            color="primary"
            onSelectionChange={(e) => {
              setCurrentFormId(e as string);
            }}
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
                      as={NextLink}
                      href={`/form/${e.id}`}
                      radius="full"
                      size="sm"
                      variant="light"
                    >
                      <i className="mdi mdi-dots-vertical" />
                    </Button>
                  </div>
                }
              />
            ))}
          </Tabs>
        </div>
        <div className="flex gap-3 items-center w-[40%]">
          <Input
            endContent={<i className="mdi mdi-magnify" />}
            placeholder="Hledat"
            onChange={(e) => {
              setSearchQuery(e.target.value);
              debouncedSearch(forms[0]?.id, e.target.value);
            }}
          />
          <Tabs
            aria-label="Options"
            color="primary"
            size="sm"
            variant="bordered"
            onSelectionChange={(e) => {
              if (e === "asc") {
                setSortOrder("asc");
              } else {
                setSortOrder("desc");
              }
            }}
          >
            <Tab
              key="desc"
              title={
                <div className="flex items-center space-x-2">
                  <span>Nejnovější</span>
                </div>
              }
            />
            <Tab
              key="asc"
              title={
                <div className="flex items-center space-x-2">
                  <span>Nejstarší</span>
                </div>
              }
            />
          </Tabs>
        </div>
      </div>

      {formTableData && (
        <>
          <div className="overflow-x-auto">
            <Table
              aria-label="Example table with dynamic content"
              onRowAction={(resId) => onRowAction(resId as string)}
              className="min-w-max"
            >
              <TableHeader columns={formTableData.table.header}>
                {(column) => (
                  <TableColumn key={column.key} allowsSorting={false}>
                    {column.label}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody items={formTableData.table.body}>
                {(item) => (
                  <TableRow
                    key={item.id}
                    className={`${!item.seen && "bg-primary-100"} radius-xl`}
                  >
                    {formTableData.table.header.map((column) => {
                      const columnKey = column.key;
                      const columnType = column.propertyType as InputType;

                      return (
                        <TableCell key={columnKey}>
                          {formatCellValue(columnType, item[columnKey])}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-between align-center mt-3">
            <Pagination
              showControls
              initialPage={1}
              page={currentPage}
              total={Math.ceil(
                (formTableData?.pagination.totalItems || 0) / perPage,
              )}
              onChange={(page) => {
                setCurrentPage(page);
                getFormTable(page, perPage, searchQuery, sortBy, sortOrder);
              }}
            />
            <Select
              className="max-w-[10rem]"
              label="Items Per Page"
              selectedKeys={new Set([perPage.toString()])}
              size="sm"
              variant="underlined"
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0];

                setPerPage(Number(value));
                getFormTable(
                  currentPage,
                  Number(value),
                  searchQuery,
                  sortBy,
                  sortOrder,
                );
              }}
            >
              {perPageItems.map((i) => (
                <SelectItem key={i.key}>{i.label}</SelectItem>
              ))}
            </Select>
          </div>
        </>
      )}
    </>
  );
};

export default FormTableComponent;
