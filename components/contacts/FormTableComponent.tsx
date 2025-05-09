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
  Chip,
  Spinner,
  DropdownItem,
  DropdownMenu,
  Dropdown,
  DropdownTrigger,
  ScrollShadow,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import NextLink from "next/link";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import debounce from "lodash.debounce";
import { useTheme } from "next-themes";

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
  const [perPage, setPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [labels, setLabels] = useState<Label[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy] = useState<string>("created_at");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formToDeleteId, setFormToDeleteId] = useState<string | null>(null);
  const [isDeletingWholeForm, setIsDeletingWholeForm] =
    useState<boolean>(false);

  const {
    onOpenChange: onOpenChangeDeletion,
    isOpen: isOpenDeletion,
    onOpen: onOpenDeletion,
  } = useDisclosure();

  const [sortOrder, setSortOrder] = useState<string>("desc");

  const { theme } = useTheme();

  const deleteForm = async (id: string) => {
    try {
      await api.delete(`forms/delete-form/${id}`);
      await getUsersForms();

      toast.success("Formulář byl úspěšně smazán!");
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const resetForm = async (id: string) => {
    try {
      await api.delete(`forms/reset-form/${id}`);
      await getFormTable();

      toast.success("Formulář byl úspěšně resetován!");
    } catch (error) {
      toast.error(`${error}`);
    }
  };

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
      const { data, status } = await api.get<{ id: string; name: string }[]>(
        `forms/get-users-forms/${userStore.user?.id}`,
      );

      setForms(status === 404 ? [] : data);
    } catch (error: any) {
      error.response.status !== 404 && toast.error(`${error}`);
    }
  };

  const getFormTable = async (
    page: number = 1,
    perPage: number = 5,
    query: string = "",
    sortBy: string = "created_at",
    sortOrder: string = "desc",
  ) => {
    setFormTableData(null);
    setIsLoading(true);
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
    } catch (error: any) {
      error.response.status !== 404 && toast.error(`${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getLabels = async () => {
    try {
      const { data, status } = await api.get(
        `label/user/${userStore.user?.id}`,
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
        return dayjs(value).format("DD. MM. YYYY");
      case InputType.FILE:
        return fileLabel((value as string[]).length);
      case InputType.LABELS:
        const wordColors = ["primary", "warning", "danger", "success"];

        return labels
          .filter((label) => value.includes(label.id))
          .map((label) => (
            <div key={label.id}>
              {wordColors.includes(label.color) ? (
                // @ts-ignore
                <Chip color={label.color} size="sm" variant="flat">
                  {label.title}
                </Chip>
              ) : (
                <Chip
                  classNames={{
                    base: `bg-${label.color}-${theme === "dark" ? "900" : "300"}`,
                    content: `text-${label.color}-${theme === "dark" ? "300" : "500"}`,
                  }}
                  size="sm"
                  variant="flat"
                >
                  {label.title}
                </Chip>
              )}
            </div>
          ));
      default:
        return value;
    }
  };

  const debouncedSearch = useCallback(
    debounce((formId, query) => {
      getFormTable(currentPage, perPage, query, sortBy, sortOrder);
    }, 500), // 500ms delay
    [currentPage, perPage, sortBy, sortOrder, currentFormId],
  );

  useEffect(() => {
    getUsersForms();
    getLabels();
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
      {formToDeleteId && (
        <Modal isOpen={isOpenDeletion} onOpenChange={onOpenChangeDeletion}>
          <ModalContent>
            <ModalHeader>Potvrďte smazání</ModalHeader>
            <ModalBody>
              <p className="text-lg">
                Tato akce je nevratná, potvrďte jí prosím.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="flat"
                onClick={() => onOpenChangeDeletion()}
              >
                Zrušit
              </Button>
              <Button
                color="danger"
                variant="shadow"
                onClick={() => {
                  isDeletingWholeForm
                    ? deleteForm(formToDeleteId)
                    : resetForm(formToDeleteId);
                  onOpenChangeDeletion();
                }}
              >
                Smazat
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      <NewFormModal isOpen={isOpenForm} onOpenChange={onOpenChangeForm} />
      {responseId && (
        <ContactModal
          isOpen={isOpen}
          refetch={getFormTable}
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
            Nový formulář
          </Button>

          <ScrollShadow
            hideScrollBar
            className="max-w-[450px]"
            offset={50}
            orientation="horizontal"
          >
            <Tabs
              className="hidden lg:block"
              color="primary"
              onSelectionChange={(e) => {
                setSearchQuery("");
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
                      <Dropdown>
                        <DropdownTrigger>
                          <Button
                            isIconOnly
                            radius="full"
                            size="sm"
                            variant="light"
                          >
                            <i
                              className={`mdi mdi-dots-vertical ${currentFormId === e.id && "text-white"}`}
                            />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                          aria-label="Dropdown menu with description"
                          variant="faded"
                        >
                          <DropdownItem
                            key="add"
                            showDivider
                            description="Přidání kontaktu přes formulář"
                            href={`https://www.brandoo.cz/form/${e.id}`}
                            startContent={<i className="mdi mdi-plus" />}
                            target="_blank"
                          >
                            Přidat
                          </DropdownItem>
                          <DropdownItem
                            key="edit"
                            showDivider
                            as={NextLink}
                            description="Upravit formulář"
                            href={`/form/${e.id}`}
                            startContent={<i className="mdi mdi-pencil" />}
                            target="_blank"
                          >
                            Upravit
                          </DropdownItem>
                          <DropdownItem
                            key="delete"
                            showDivider
                            className="text-danger"
                            color="danger"
                            description="Smazání formuláře"
                            startContent={<i className="mdi mdi-delete" />}
                            onClick={() => {
                              setFormToDeleteId(e.id);
                              setIsDeletingWholeForm(true);
                              onOpenDeletion();
                            }}
                          >
                            Smazat
                          </DropdownItem>
                          <DropdownItem
                            key="delete"
                            className="text-danger"
                            color="danger"
                            description="Tato akce smaže všechny odpovědi"
                            startContent={<i className="mdi mdi-delete" />}
                            onClick={() => {
                              setFormToDeleteId(e.id);
                              setIsDeletingWholeForm(false);
                              onOpenDeletion();
                            }}
                          >
                            Resetovat
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  }
                />
              ))}
            </Tabs>
          </ScrollShadow>
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

      {formTableData ? (
        <>
          <div className="overflow-x-auto">
            <Table
              aria-label="Example table with dynamic content"
              className="min-w-max"
              selectionMode="multiple"
              onRowAction={(resId) => onRowAction(resId as string)}
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
              total={formTableData?.pagination.totalItems}
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
      ) : (
        <div className="w-full mt-20 grid place-content-center">
          <div className="flex flex-col justify-center items-center">
            {isLoading ? (
              <Spinner size="lg" />
            ) : (
              <>
                <p className="font-bold text-2xl text-default-700 mb-3">
                  Zatím nemáte žádné formuláře 😬
                </p>
                <Button
                  color="primary"
                  endContent={<i className="mdi mdi-plus" />}
                  size="lg"
                  variant="shadow"
                  onClick={() => onOpenForm()}
                >
                  Vytvořit první formulář
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FormTableComponent;
