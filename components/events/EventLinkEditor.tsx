import { Chip } from "@nextui-org/react";
import React, { FC, useState, useRef, useEffect } from "react";

import { api } from "@/utils/api";

interface EventLinkEditorProps {
  links: string; // Vstupní prop jako string s více odkazy oddělenými čárkou
  onChange?: (newLinks: string) => void;
}

const EventLinkEditor: FC<EventLinkEditorProps> = ({ links, onChange }) => {
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [currentLinks, setCurrentLinks] = useState<string>(links);
  const [chipData, setChipData] = useState<
    Array<{ link: string; title: string }>
  >([]);
  const editableRef = useRef<HTMLDivElement>(null);

  // Funkce pro ziskani titulku z backendu nebo linku samotneho, pokud nelze ziskat titulek
  const fetchMetaTitle = async (url: string) => {
    try {
      // Pokud URL obsahuje "meet.google.com", rovnou vrátíme "Google Meet"
      if (url.includes("meet.google.com")) {
        return { link: url, title: "Google Meet" };
      }

      // Volání backendu pro získání titulku
      const { data } = await api.get(
        `get-title?url=${encodeURIComponent(url)}`,
      );

      // Pokud se podaří získat titulek, vrátíme ho
      if (data.title) {
        return { link: url, title: data.title };
      }

      // Pokud není možné získat titulek, vrátíme samotný link
      return { link: url, title: url };
    } catch (error) {
      console.error("Error fetching meta title:", error);

      // Pokud dojde k chybě, vrátíme samotný link
      return { link: url, title: url };
    }
  };

  // Funkce na rozdělení odkazu podle čárky a fetch každého titulu jeden po druhém
  const processLinks = async (links: string) => {
    // Rozdělení řetězce na pole, kde bude ignorována mezera kolem čárky
    const linkArray = links.split(",").map((link) => link.trim());
    const chipDataPromises = linkArray.map((link) => fetchMetaTitle(link));
    const chipDataResults = await Promise.all(chipDataPromises);

    setChipData(chipDataResults);
  };

  useEffect(() => {
    processLinks(currentLinks); // Zpracování odkazů při změně links
  }, [currentLinks]);

  const handleBlur = () => {
    setIsEditable(false);
    if (editableRef.current) {
      const updatedLinks = editableRef.current.innerText;

      setCurrentLinks(updatedLinks);
      if (onChange) {
        onChange(updatedLinks);
      }
    }
  };

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleChipClick = (e: string) => {
    window.open(e, "_blank");
  };

  useEffect(() => {
    if (isEditable && editableRef.current) {
      editableRef.current.focus();
    }
  }, [isEditable]);

  if (isEditable) {
    return (
      <div
        ref={editableRef}
        contentEditable
        suppressContentEditableWarning={true}
        tabIndex={-1} // Allow focus
        onBlur={handleBlur}
      >
        {currentLinks}
      </div>
    );
  } else {
    return (
      <div className="gap-1 flex mt-1">
        <div className="flex items-center gap-1 cursor-pointer">
          <Chip color="primary" variant="shadow" onClick={handleEditClick}>
            <i className="mdi mdi-pencil" />
          </Chip>
          {links !== "" &&
            chipData.map((chip, index) => (
              <Chip
                key={index}
                size="md"
                onClick={() => handleChipClick(chip.link)}
              >
                {chip.title}
              </Chip>
            ))}
        </div>
      </div>
    );
  }
};

export default EventLinkEditor;
