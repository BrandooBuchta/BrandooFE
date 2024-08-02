import { FC, useState, useEffect } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Code,
  Input,
  Modal,
  ModalContent,
  Snippet,
  Textarea,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import Link from "next/link";

import { api } from "@/utils/api";
import useUserStore from "@/stores/user";
import { Form } from "@/interfaces/contacts";
import { SELECT_FORM_PROPERTIES } from "@/constants/contact";

interface FormModalProps {
  onOpenChange: () => void;
  isOpen: boolean;
  form: Form | null;
  refetch: () => Promise<void>;
}

const DEFAULT_KEYS = ["agreedToPrivacyPolicy", "email"];

const FormModal: FC<FormModalProps> = ({
  onOpenChange,
  isOpen,
  form,
  refetch,
}) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [formProperties, setFormProperties] = useState<string[]>(DEFAULT_KEYS);
  const userStore = useUserStore();

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Zkopírováno do schránky");
    } catch (e) {
      toast.error(`${e}`);
    }
  };

  useEffect(() => {
    if (form) {
      setName(form.name);
      setDescription(form.description);
      setFormProperties(form.formProperties);

      return;
    }
    setName("");
    setDescription("");
    setFormProperties(DEFAULT_KEYS);
  }, [form]);

  const selectKey = (key: string) => {
    if (!formProperties.includes(key)) {
      setFormProperties((prev) => [...prev, key]);

      return;
    }
    setFormProperties(formProperties.filter((e) => e !== key));
  };

  const slideInFromRight = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
  };

  const onSubmit = async () => {
    try {
      await api[form ? "put" : "post"](
        `contacts/form/${form ? form.id : userStore.user?.id}`,
        {
          name,
          description,
          formProperties,
        },
      );
      toast.success("Form successfully saved!");
      await refetch();
      onOpenChange();
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const deleteForm = async () => {
    if (!form) return;
    try {
      await api.delete(`contacts/form/${form.id}`);
      toast.success("Form successfully saved!");
      await refetch();
      onOpenChange();
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  return (
    <Modal
      backdrop="opaque"
      className="w-1/2 transform translate-x-1/2"
      isOpen={isOpen}
      motionProps={{
        initial: "hidden",
        animate: "visible",
        exit: "hidden",
        variants: slideInFromRight,
        transition: { duration: 0.3 },
      }}
      size="full"
      onOpenChange={onOpenChange}
    >
      <ModalContent className="p-5 h-full overflow-scroll">
        <div className="h-full">
          <Card className="p-0" shadow="none">
            <CardHeader>
              <h2 className="text-2xl font-bold text-default-600">
                {form ? "Upravit formulář" : "Nový formulář"}
              </h2>
            </CardHeader>
            <CardBody>
              <Input
                className="mb-2"
                color="primary"
                label="Jméno"
                placeholder="Objednávkový Formulář 1"
                value={name}
                variant="bordered"
                onChange={(e) => setName(e.target.value)}
              />
              <Textarea
                color="primary"
                label="Popis"
                placeholder="Popisek formulář"
                value={description}
                variant="bordered"
                onChange={(e) => setDescription(e.target.value)}
              />
              <span className="mt-5 text-lg">Vlastnosti formuláře</span>
              <span className="text-xs mb-1 mt-2 text-primary">
                <i className="mdi mdi-information-outline" />
                {` "Email" a "Souhlasil s podmínkami" musí mít každý formulář.`}
              </span>
              <div className="flex flex-wrap gap-3 mt-2 mb-3">
                {SELECT_FORM_PROPERTIES.map((prop) => (
                  <Chip
                    key={prop.key}
                    className="cursor-pointer"
                    color={
                      formProperties.includes(prop.key) ? "primary" : "default"
                    }
                    isDisabled={DEFAULT_KEYS.includes(prop.key)}
                    size="sm"
                    variant={
                      formProperties.includes(prop.key) ? "shadow" : "solid"
                    }
                    onClick={() => selectKey(prop.key)}
                  >
                    {prop.name}
                  </Chip>
                ))}
              </div>
            </CardBody>
            <CardFooter className="flex justify-between gap-2 pb-5">
              {form && (
                <ButtonGroup color="primary" variant="shadow">
                  <Button
                    as={Link}
                    href={`https://www.brandoo.cz/form/${form.id}`}
                    target="_blank"
                  >
                    Vytvořit kontakt
                  </Button>
                  <Button
                    isIconOnly
                    startContent={<i className="mdi mdi-content-copy" />}
                    onPress={() =>
                      handleCopy(`https://www.brandoo.cz/form/${form.id}`)
                    }
                  />
                </ButtonGroup>
              )}
              <div className="flex gap-2">
                {form && (
                  <Button
                    color="danger"
                    endContent={<i className="mdi mdi-pencil" />}
                    variant="shadow"
                    onPress={() => deleteForm()}
                  >
                    Smazat
                  </Button>
                )}
                <Button
                  color="primary"
                  endContent={
                    form ? (
                      <i className="mdi mdi-pencil" />
                    ) : (
                      <i className="mdi mdi-plus" />
                    )
                  }
                  variant="shadow"
                  onPress={() => onSubmit()}
                >
                  {form ? "Upravit" : "Vytvořit"}
                </Button>
              </div>
            </CardFooter>
          </Card>
          {form && userStore.isDevMode && (
            <Card className="p-0 pb-10" shadow="none">
              <CardHeader>
                <h2 className="text-2xl font-bold text-default-600">
                  Pro vývojáře
                </h2>
              </CardHeader>
              <CardBody className="flex flex-col gap-2">
                <span className="text-default-600 font-semibold text-lg mb-0">
                  API Endpoints
                </span>
                <span className="text-default-500 text-md">
                  Přidání hodnoty do statistiky
                </span>
                <div className="flex items-center mb-2">
                  <Chip
                    className="px-4 mr-1 py-5"
                    color="success"
                    radius="sm"
                    size="lg"
                    variant="shadow"
                  >
                    POST
                  </Chip>
                  <Snippet
                    className="flex w-full"
                    size="sm"
                    symbol={null}
                    variant="bordered"
                  >
                    <span>{`/api/contacts/new-contact/${form?.id}`}</span>
                  </Snippet>
                </div>
                <Code className="p-4 mb-10">
                  {`{`}
                  <div className="ml-4">
                    {form.formProperties.map((e) => (
                      <div key={e}>
                        <span>{`${e}: "${["agreedToPrivacyPolicy", "agreedToNewsLetter"].includes(e) ? "boolean" : "string"}",`}</span>
                        <br />
                      </div>
                    ))}
                  </div>
                  {`}`}
                </Code>
                <div className="flex flex-col items-start mb-10">
                  <span className="text-default-600 font-semibold text-lg">
                    Podmínky zpracování osobních údajů
                  </span>
                  <span className="text-default-500 text-sm">
                    <h6 className="text-default-600 font-bold">
                      Vytvořili jsme pro váš formulář podmínky zpracování
                      osobních údajů.
                    </h6>
                    <br />
                    <ul className="list-disc ml-4 mb-2">
                      <li>
                        Formulář musí být uveden společně s potvrzením (např.
                        Checkbox, Switch nebo text <br />
                        {`"Odesláním souhlasím s podmínkami zpracování osobních
                          údajú"`}
                        ) pod formulářem.
                      </li>
                      <li>
                        V opačném případě vás budeme kontaktovat, pokud se tak
                        stane více než třikrát bude váš účet smazán. Souhlas a
                        obeznámení uživatele s podmínky je klíčový pro
                        spokojenost obou stran.
                      </li>
                    </ul>
                  </span>
                  <ButtonGroup color="primary" variant="shadow">
                    <Button
                      as={Link}
                      href={`https://www.brandoo.cz/terms-and-conditions/${form.id}`}
                      target="_blank"
                    >
                      Podmínky zpracování osobních údajů
                    </Button>
                    <Button
                      isIconOnly
                      startContent={<i className="mdi mdi-content-copy" />}
                      onPress={() =>
                        handleCopy(
                          `https://www.brandoo.cz/terms-and-conditions/${form.id}`,
                        )
                      }
                    />
                  </ButtonGroup>
                </div>
                <span className="text-default-600 font-semibold text-lg">
                  Testování
                </span>
                <div className="flex gap-3">
                  <ButtonGroup color="primary" variant="shadow">
                    <Button
                      as={Link}
                      href={`https://www.brandoo.cz/form/${form.id}`}
                      target="_blank"
                    >
                      Testovací Formulář
                    </Button>
                    <Button
                      isIconOnly
                      startContent={<i className="mdi mdi-content-copy" />}
                      onPress={() =>
                        handleCopy(`https://www.brandoo.cz/form/${form.id}`)
                      }
                    />
                  </ButtonGroup>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
};

export default FormModal;
