import React, {
  useState,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
  FC,
} from "react";
import { Button, Card, CardBody, Select, SelectItem } from "@nextui-org/react";

interface WysiwygEditorProps {
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
}

const WysiwygEditor: FC<WysiwygEditorProps> = ({ setContent }) => {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const editorRef = useRef<HTMLDivElement | null>(null);

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    updateFormattingStates();
    handleInput();
  };

  const handleInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const updateFormattingStates = () => {
    setIsBold(document.queryCommandState("bold"));
    setIsItalic(document.queryCommandState("italic"));
    setIsUnderline(document.queryCommandState("underline"));
  };

  useEffect(() => {
    document.addEventListener("selectionchange", updateFormattingStates);

    return () => {
      document.removeEventListener("selectionchange", updateFormattingStates);
    };
  }, []);

  const handleTextSizeChange = (key: string) => {
    const newSize = {
      "text-xs": "0.75rem",
      "text-sm": "0.875rem",
      "text-md": "1rem",
      "text-lg": "1.125rem",
      "text-xl": "1.25rem",
    }[key];

    document.execCommand("fontSize", false, "7");
    const fontElements = document.getElementsByTagName("font");

    for (let i = 0; i < fontElements.length; i++) {
      if (fontElements[i].size === "7") {
        fontElements[i].removeAttribute("size");
        // @ts-ignore
        fontElements[i].style.fontSize = newSize;
      }
    }
    handleInput();
  };

  const handleAlignment = (align: string) => {
    document.execCommand(align);
    handleInput();
  };

  return (
    <Card>
      <CardBody>
        <div className="flex space-x-2 mb-4">
          <Button
            isIconOnly
            color={isBold ? "primary" : "default"}
            size="sm"
            startContent={<i className="mdi mdi-format-bold text-xl" />}
            variant="faded"
            onClick={() => formatText("bold")}
          />
          <Button
            isIconOnly
            color={isItalic ? "primary" : "default"}
            size="sm"
            startContent={<i className="mdi mdi-format-italic text-xl" />}
            variant="faded"
            onClick={() => formatText("italic")}
          />
          <Button
            isIconOnly
            color={isUnderline ? "primary" : "default"}
            size="sm"
            startContent={<i className="mdi mdi-format-underline text-xl" />}
            variant="faded"
            onClick={() => formatText("underline")}
          />
          <Select
            aria-label="Text Size"
            color="primary"
            placeholder="Select Text Size"
            size="sm"
            variant="faded"
            onChange={(e) => handleTextSizeChange(e.target.value)}
          >
            <SelectItem key="text-xs" value="text-xs">
              X-Small
            </SelectItem>
            <SelectItem key="text-sm" value="text-sm">
              Small
            </SelectItem>
            <SelectItem key="text-md" value="text-md">
              Medium
            </SelectItem>
            <SelectItem key="text-lg" value="text-lg">
              Large
            </SelectItem>
            <SelectItem key="text-xl" value="text-xl">
              X-Large
            </SelectItem>
          </Select>
          <Button
            isIconOnly
            size="sm"
            startContent={<i className="mdi mdi-format-align-left text-xl" />}
            variant="faded"
            onClick={() => handleAlignment("justifyLeft")}
          />
          <Button
            isIconOnly
            size="sm"
            startContent={<i className="mdi mdi-format-align-center text-xl" />}
            variant="faded"
            onClick={() => handleAlignment("justifyCenter")}
          />
          <Button
            isIconOnly
            size="sm"
            startContent={<i className="mdi mdi-format-align-right text-xl" />}
            variant="faded"
            onClick={() => handleAlignment("justifyRight")}
          />
          <Button
            isIconOnly
            size="sm"
            startContent={
              <i className="mdi mdi-format-align-justify text-xl" />
            }
            variant="faded"
            onClick={() => handleAlignment("justifyFull")}
          />
        </div>
        <div
          ref={editorRef}
          contentEditable
          style={{
            height: "300px",
            padding: "15px",
            background: "#eeeeee",
            color: "black",
            borderRadius: "5px",
          }}
          onInput={handleInput}
        />
      </CardBody>
    </Card>
  );
};

export default WysiwygEditor;
