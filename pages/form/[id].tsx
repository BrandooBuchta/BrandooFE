import { FC, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { GetServerSideProps } from "next";
import { Button, Card, Spinner, useDisclosure } from "@nextui-org/react";
import Head from "next/head";
import Cookies from "js-cookie";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Link from "next/link";

import { api } from "@/utils/api";
import { FormPropertyType, FormWithProperties } from "@/interfaces/form";
import { InputType } from "@/components/contacts/input-types/InputTypes";
import { convertToKey } from "@/utils/convertors";
import FormProperty from "@/components/contacts/FormProperty";
import FormAPIModal from "@/components/contacts/FormAPIModal";
import AsyncButton from "@/components/UI/AsyncButton";
const Form: FC<{ id: string }> = ({ id }) => {
  const { onOpenChange, isOpen, onOpen } = useDisclosure();
  const [formProperties, setFormProperties] = useState<FormPropertyType[]>([]);
  const [form, setForm] = useState<FormWithProperties | null>(null);
  const [name, setName] = useState<string>("");
  const [isClient, setIsClient] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");

  const getFormWithProperties = async () => {
    try {
      const { data } = await api.get<FormWithProperties>(
        `forms/get-form/${id}`,
      );

      setForm(data);
      setFormProperties(data.properties);
      setName(data.name);
      setDescription(data.description);
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const saveChanges = async () => {
    try {
      const properties = formProperties.map((prop) => {
        if (prop.options && prop.options.length < 1) delete prop.options;
        if (prop.id?.startsWith("subId")) delete prop.id;

        return {
          ...prop,
          key: convertToKey(prop.label),
        };
      });

      await api.put(`forms/update-form/${id}`, {
        name,
        description,
        properties,
      });

      toast.success("Formulář byl úspěšně uložen");
      await getFormWithProperties();
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const deleteForm = async () => {
    try {
      await api.delete(`forms/delete-form/${id}`);

      toast.success("Formulář byl úspěšně smazán!");
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const getTestRes = async () => {
    const privateKey = Cookies.get("privateKey");

    if (!privateKey) return;

    try {
      await api.get(`forms/form-table/${id}`, {
        headers: {
          "X-Private-Key": privateKey,
        },
      });
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const addFormProperty = (key: string) => {
    const newProperty: FormPropertyType = {
      key,
      label: `Nová vlastnost ${formProperties.length + 1}`,
      propertyType: InputType.SHORT_TEXT,
      options: [],
      position: formProperties.length + 1,
      id: `subId-${Math.fround(Math.random())}`,
      required: true,
    };

    setFormProperties([...formProperties, newProperty]);
  };

  const moveProperty = (dragIndex: number, hoverIndex: number) => {
    const draggedProperty = formProperties[dragIndex];
    const updatedProperties = [...formProperties];

    updatedProperties.splice(dragIndex, 1);
    updatedProperties.splice(hoverIndex, 0, draggedProperty);

    setFormProperties(
      updatedProperties.map((e, idx) => ({ ...e, position: idx + 1 })),
    );
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    isClient && getFormWithProperties();
  }, [isClient]);

  if (!form) {
    return <Spinner />;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <FormAPIModal form={form} isOpen={isOpen} onOpenChange={onOpenChange} />
      <Head>
        <title>{name}</title>
        <meta key="title" content={name} property="og:title" />
      </Head>
      <Card className="flex justify-between items-center p-2 gap-3 flex-row">
        <p className="text-xl font-bold pl-2">Form Studio</p>
        <div className="flex gap-2">
          <Button
            as={Link}
            color="primary"
            href={`https://www.brandoo.cz/form/${id}`}
            size="lg"
            target="_blank"
            variant="flat"
          >
            Náhled
          </Button>
          <AsyncButton
            color="primary"
            size="lg"
            variant="shadow"
            onClick={saveChanges}
          >
            Uložit změny
          </AsyncButton>
          <AsyncButton
            color="danger"
            size="lg"
            variant="shadow"
            onClick={() => deleteForm()}
          >
            Smazat formulář
          </AsyncButton>
          <Button
            color="primary"
            size="lg"
            variant="flat"
            onClick={() => onOpen()}
          >
            API
          </Button>
        </div>
      </Card>
      <div className="container mx-auto max-w-[768px] py-10 px-3 rounded flex flex-col gap-3">
        <Card className="flex flex-col p-5">
          <h2
            className="capitalize text-2xl font-bold"
            contentEditable={true}
            onBlur={(e) => setName(e.currentTarget.textContent || "")}
          >
            {name}
          </h2>
          <h3
            className="text-lg text-default-500"
            contentEditable={true}
            onBlur={(e) => setDescription(e.currentTarget.textContent || "")}
          >
            {description}
          </h3>
          {formProperties.length === 2 && (
            <>
              <span className="text-xs mt-1 text-primary">
                <i className="mdi mdi-information-outline" />
                {`"Email" je vysoce doporučený údaj který by měl obsahovat každý formulář, můžete ho ale smazat.`}
              </span>
              <span className="text-xs mb-1 mt-1 text-primary">
                <i className="mdi mdi-information-outline" />
                {`"Souhlasím s podmínkami zpracování osobních údajů" musí obsahovat každý formulář z důvodu ctění soukromí vašich klientů.`}
              </span>
            </>
          )}
        </Card>
        <div className="flex flex-col gap-3">
          {formProperties.map((property, index) => (
            <FormProperty
              key={property.key || index}
              formProperties={formProperties}
              index={index}
              moveProperty={moveProperty}
              property={property}
              refetch={getFormWithProperties}
              setFormProperties={setFormProperties}
              onPropertyChange={(updatedProperty) =>
                setFormProperties((prev) =>
                  prev.map((prop) =>
                    prop.key === updatedProperty.key ? updatedProperty : prop,
                  ),
                )
              }
            />
          ))}
        </div>
        <Button
          color="primary"
          endContent={<i className="mdi mdi-plus" />}
          onClick={() => addFormProperty(`${Math.random()}`)}
        >
          Přidat
        </Button>
      </div>
    </DndProvider>
  );
};

export default Form;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.query.id;

  if (typeof id !== "string") {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      id,
    },
  };
};
