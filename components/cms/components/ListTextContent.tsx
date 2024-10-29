import React, { FC, useEffect, useRef, useState } from "react";
import { Button, Input } from "@nextui-org/react";

import { ContentTypeComponent } from "@/interfaces/content";
import useContentStore from "@/stores/cms";
import AsyncButton from "@/components/UI/AsyncButton";

const ListTextContent: FC<ContentTypeComponent> = ({ content }) => {
  const [currentEditedIdx, setCurrentEditedIdx] = useState<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const contentStore = useContentStore();

  const updateTextContent = async () => {
    try {
      await contentStore.updateContent(content.id, { listTextContent: texts });
    } catch (error) {
      console.error(error);
    }
  };

  const [texts, setTexts] = useState<string[]>(content.listTextContent || []);

  useEffect(() => {
    setTexts(texts);
  }, [texts]);

  const handleInputChange = (index: number, value: string) => {
    const newTexts = [...texts];

    newTexts[index] = value;
    setTexts(newTexts);
  };

  const addText = async () => {
    const newText = `Možnost ${texts.length + 1}`;
    const newTexts = [...texts, newText];

    setTexts(newTexts);
    await updateTextContent();
    setCurrentEditedIdx(texts.length);
  };

  const removeText = (text: string) => {
    const editedTexts = texts.filter((e) => e !== text);

    setTexts(editedTexts);
  };

  useEffect(() => {
    if (currentEditedIdx !== null && inputRefs.current[currentEditedIdx]) {
      inputRefs.current[currentEditedIdx]?.focus();
      inputRefs.current[currentEditedIdx]?.select();
    }
  }, [currentEditedIdx]);

  return (
    <div>
      {texts.map((text, idx) => (
        <Input
          key={idx}
          ref={(el) => (inputRefs.current[idx] = el)}
          className="py-1"
          endContent={
            <Button
              isIconOnly
              color="danger"
              radius="full"
              size="sm"
              startContent={<i className="mdi mdi-delete text-lg" />}
              variant="light"
              onClick={() => removeText(text)}
            />
          }
          startContent={
            <i
              className={`mdi mdi-circle-small text-2xl ${currentEditedIdx === idx && "text-primary"}`}
            />
          }
          value={text}
          variant="underlined"
          onBlur={updateTextContent}
          onChange={({ target: { value } }) => handleInputChange(idx, value)}
          onFocus={() => setCurrentEditedIdx(idx)}
        />
      ))}
      <div className="flex justify-center mt-5">
        <AsyncButton
          isIconOnly
          color="primary"
          radius="full"
          size="md"
          startContent={<i className="mdi mdi-plus text-xl" />}
          variant="shadow"
          onPress={() => addText()}
        />
      </div>
    </div>
  );
};

export default ListTextContent;
