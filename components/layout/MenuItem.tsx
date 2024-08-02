import { Button, Chip } from "@nextui-org/react";
import { useRouter } from "next/router";
import { FC } from "react";

import { Link } from "@/interfaces/link";

interface MenuItemProps {
  link: Link;
}

export const MenuItem: FC<MenuItemProps> = ({ link }) => {
  const router = useRouter();
  const isSelected = link.href && router.pathname.includes(link.href);

  return (
    <>
      <Button
        className="justify-between w-full"
        color={isSelected ? "primary" : "default"}
        radius="sm"
        variant={link.variant ? link.variant : "light"}
        onClick={() => {
          if (link.href) router.push(link.href);
          if (link.fn) link.fn();
        }}
      >
        <div className="flex items-center">
          <i className={`mdi mdi-${link.icon} text-lg mr-3`} />
          <span className="text-md h-fit">{link.name}</span>
        </div>
        {!!(link.value && link.value > 0) && (
          <Chip color="primary" radius="full" size="sm" variant="solid">
            {link.value}
          </Chip>
        )}
      </Button>
      {link.links && link.href && router.pathname.includes(link.href) && (
        <div className="ml-3 w-full">
          {link.links.map((e) => (
            <MenuItem key={e.name} link={e} />
          ))}
        </div>
      )}
    </>
  );
};
