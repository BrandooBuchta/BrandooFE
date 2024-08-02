import React, { FC, useEffect, useRef, useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Listbox,
  ListboxItem,
  Chip,
  Button,
  Input,
  SelectItem,
  Select,
} from "@nextui-org/react";
import { useTheme } from "next-themes";
import { toast } from "react-toastify";

import { colors } from "./data";

import { cn } from "@/utils/cn";
import { api, setAuthTokenHeader } from "@/utils/api";
import useUserStore from "@/stores/user";
import { Contact, Label } from "@/interfaces/contacts";

interface LabelDropdownProps {
  contact: Contact;
  refetch?: () => Promise<void>;
}

export const LabelDropdown: FC<LabelDropdownProps> = ({ contact, refetch }) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [labels, setLabels] = useState<Label[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<Set<string>>(
    new Set([...contact.labels]),
  );

  const [isEditingModeEnabled, setIsEditingModeEnabled] =
    useState<boolean>(false);

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [currentEditedLabelId, setCurrentEditedLabelId] = useState<
    string | null
  >(null);
  const [title, setTitle] = useState<string>("");
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const userStore = useUserStore();
  const { theme } = useTheme();
  const wordColors = ["primary", "warning", "danger", "success"];

  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0 mdi";

  const inputRef = useRef<HTMLInputElement | null>(null);

  const onSubmit = async () => {
    try {
      userStore.token?.authToken &&
        setAuthTokenHeader(userStore.token?.authToken);
      await api[isEditingModeEnabled ? "put" : "post"](
        `contacts/label/${isEditingModeEnabled ? currentEditedLabelId : userStore.user?.id}`,
        {
          title,
          color: selectedColor,
        },
      );
      await getLabels();
      setSelectedColor(null);
      setTitle("");
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const deleteLabel = async (id: string) => {
    try {
      if (contact.labels.includes(id)) {
        const filteredContacts = contact.labels.filter((e) => e !== id);

        await updateContactLabels(filteredContacts);
      }
      userStore.token?.authToken &&
        setAuthTokenHeader(userStore.token?.authToken);
      await api.delete(`contacts/label/${id}`);
      await getLabels();
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const startEdit = (id: string) => {
    setCurrentEditedLabelId(id);
    const labelToEdit = labels.find((label) => label.id === id);

    if (labelToEdit) {
      setSelectedColor(labelToEdit.color);
      setTitle(labelToEdit.title);
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

  const updateContactLabels = async (labelsToUpdate: string[]) => {
    try {
      userStore.token?.authToken &&
        setAuthTokenHeader(userStore.token?.authToken);
      await api.put(`contacts/update-contact-labels/${contact.id}`, {
        labels: labelsToUpdate,
      });
      refetch && (await refetch());
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const handleDropdownOpenChange = (open: boolean) => {
    if (!open && isDropdownOpen) {
      setDropdownOpen(true);
    } else {
      setDropdownOpen(open);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    getLabels();
  }, []);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {labels
          .filter((label) => contact.labels.includes(label.id))
          .map((label) => (
            <div key={label.id}>
              {wordColors.includes(label.color) ? (
                // @ts-ignore
                <Chip color={label.color} variant="flat">
                  {label.title}
                </Chip>
              ) : (
                <Chip
                  classNames={{
                    base: `bg-${label.color}-${theme === "dark" ? "900" : "300"}`,
                    content: `text-${label.color}-${theme === "dark" ? "300" : "500"}`,
                  }}
                  variant="flat"
                >
                  {label.title}
                </Chip>
              )}
            </div>
          ))}
      </div>
      <div ref={dropdownRef}>
        <Dropdown
          className="w-[280px]"
          isOpen={isDropdownOpen}
          onOpenChange={handleDropdownOpenChange}
        >
          <DropdownTrigger>
            <Button
              isIconOnly
              aria-label="menu"
              color="primary"
              radius="full"
              size="sm"
              variant="shadow"
              onPress={() => setDropdownOpen((prev) => !prev)}
            >
              <span className="mdi mdi-pencil text-lg" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Dropdown menu with description"
            closeOnSelect={false}
            variant="light"
          >
            <DropdownSection
              key="select-labels"
              showDivider
              title="Vybrat štítky"
            >
              <DropdownItem key="new">
                <Listbox
                  disallowEmptySelection
                  aria-label="Multiple selection example"
                  selectedKeys={selectedLabels}
                  selectionMode={isEditingModeEnabled ? "none" : "multiple"}
                  variant="flat"
                  onSelectionChange={(keys) => {
                    const labels: string[] = Array.from(keys) as string[];

                    setSelectedLabels(new Set(labels));
                    updateContactLabels(labels);
                  }}
                >
                  {labels.map((label) => (
                    <ListboxItem key={label.id} textValue={label.title}>
                      <div className="flex justify-between">
                        {wordColors.includes(label.color) ? (
                          // @ts-ignore
                          <Chip color={label.color} variant="flat">
                            {label.title}
                          </Chip>
                        ) : (
                          <Chip
                            classNames={{
                              base: `bg-${label.color}-${theme === "dark" ? "900" : "300"}`,
                              content: `text-${label.color}-${theme === "dark" ? "300" : "500"}`,
                            }}
                            variant="flat"
                          >
                            {label.title}
                          </Chip>
                        )}
                        {isEditingModeEnabled && (
                          <div className="flex gap-1">
                            <button
                              className="mdi mdi-pencil text-lg text-primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                startEdit(label.id);
                              }}
                            />
                            <button
                              className="mdi mdi-delete text-lg text-danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteLabel(label.id);
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </ListboxItem>
                  ))}
                </Listbox>
              </DropdownItem>
            </DropdownSection>
            <DropdownSection
              key="create-label"
              showDivider
              title="Create label"
            >
              <DropdownItem>
                <div className="p-1 flex flex-col gap-2">
                  <Input
                    ref={inputRef}
                    color="primary"
                    label="Title"
                    labelPlacement="outside"
                    placeholder="Important"
                    size="sm"
                    value={title}
                    variant="bordered"
                    onChange={(e) => setTitle(e.target.value)}
                    onClick={() => inputRef.current?.focus()}
                  />
                  <Select
                    color="primary"
                    endContent={
                      <i
                        className={cn(
                          `mdi mdi-circle`,
                          selectedColor && wordColors.includes(selectedColor)
                            ? `text-${selectedColor}`
                            : `text-${selectedColor}-500`,
                        )}
                      />
                    }
                    label="Color"
                    labelPlacement="outside"
                    selectedKeys={selectedColor ? [selectedColor] : []}
                    size="sm"
                    variant="bordered"
                    onOpenChange={(open) => handleDropdownOpenChange(open)}
                    onSelectionChange={(keys) =>
                      setSelectedColor(Array.from(keys)[0] as string)
                    }
                  >
                    {colors.map((color) => (
                      <SelectItem
                        key={color.value}
                        endContent={
                          <i
                            className={cn(
                              `mdi mdi-circle`,
                              wordColors.includes(color.value)
                                ? `text-${color.value}`
                                : `text-${color.value}-500`,
                            )}
                          />
                        }
                        textValue={color.value}
                      >
                        {color.title}
                      </SelectItem>
                    ))}
                  </Select>
                  <Button
                    color="primary"
                    endContent={
                      isEditingModeEnabled ? (
                        <i className="mdi mdi-pencil" />
                      ) : (
                        <i className="mdi mdi-plus" />
                      )
                    }
                    size="md"
                    onClick={onSubmit}
                  >
                    {isEditingModeEnabled ? "Upravit" : "Přidat"}
                  </Button>
                </div>
              </DropdownItem>
            </DropdownSection>
            {/* TODO: From swtiching back to non-edit reset form */}
            <DropdownSection key="labels-actions" title="Labels actions">
              <DropdownItem
                key="edit"
                className={isEditingModeEnabled ? "text-primary" : ""}
                description="Upravování barvy a textu štítků"
                startContent={
                  <i
                    className={`${iconClasses} mdi-pencil ${isEditingModeEnabled && "text-primary"}`}
                  />
                }
                onClick={() => setIsEditingModeEnabled((prev) => !prev)}
              >
                Úprava štítků
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </div>
    </>
  );
};

export default LabelDropdown;
