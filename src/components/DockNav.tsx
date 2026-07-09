import type { ReactNode } from 'react'
import frame1000003409 from './nav-icons/frame-1000003409.svg'
import frame1000003410 from './nav-icons/frame-1000003410.svg'
import { ImagesDuotone } from './nav-icons/ImagesDuotone'
import image1 from './nav-icons/image-1.png'
import { MingcutePinterestFill } from './nav-icons/MingcutePinterestFill'
import { PaintBrushDuotone } from './nav-icons/PaintBrushDuotone'

type NavItem =
  | {
      type: "active-icon";
      label: string;
      icon: ReactNode;
    }
  | {
      type: "image";
      label: string;
      src: string;
      imgAlt: string;
      className: string;
    }
  | {
      type: "icon";
      label: string;
      icon: ReactNode;
      className: string;
    };

export default function DockNav() {
  const navItems: NavItem[] = [
    {
      type: "active-icon",
      label: "Paint Brush",
      icon: <PaintBrushDuotone className="!relative !w-6 !h-6" />,
    },
    {
      type: "image",
      label: "X",
      src: frame1000003409,
      imgAlt: "X",
      className:
        "h-[50px] mt-[-1.00px] mb-[-1.00px] ml-[-8.01e-05px] relative flex-1 grow object-contain",
    },
    {
      type: "icon",
      label: "Pinterest",
      icon: (
        <MingcutePinterestFill className="!relative !w-6 !h-6 !aspect-[1]" />
      ),
      className:
        "flex flex-col h-[50px] items-center justify-center gap-1 px-2 py-1 relative flex-1 grow mt-[-1.00px] mb-[-1.00px] ml-[-8.01e-05px]",
    },
    {
      type: "image",
      label: "Behance",
      src: frame1000003410,
      imgAlt: "Behance",
      className:
        "h-[50px] mt-[-1.00px] mb-[-1.00px] ml-[-8.01e-05px] relative flex-1 grow object-contain",
    },
    {
      type: "icon",
      label: "Images",
      icon: <ImagesDuotone className="!relative !w-6 !h-6" />,
      className:
        "flex flex-col h-[50px] items-center justify-center gap-1 px-2 py-1 relative flex-1 grow mt-[-1.00px] mb-[-1.00px] ml-[-8.01e-05px]",
    },
    {
      type: "icon",
      label: "Profile",
      icon: (
        <img
          className="relative w-7 h-7 aspect-[1] object-cover"
          alt="Profile"
          src={image1}
        />
      ),
      className:
        "flex flex-col h-[50px] items-center justify-center gap-1 px-2 py-1 relative flex-1 grow mt-[-1.00px] mb-[-1.00px] ml-[-8.01e-05px]",
    },
  ];

  return (
    <nav
      aria-label="Creative platform navigation"
      className="flex w-[360px] h-[52px] items-center justify-between p-0.5 relative bg-[#ffffffe6] rounded-[36px]"
    >
      {navItems.map((item, index) => {
        if (item.type === "active-icon") {
          return (
            <button
              key={`${item.label}-${index}`}
              type="button"
              aria-label={item.label}
              aria-current="page"
              className="flex flex-col h-12 items-center justify-center gap-1 px-4 py-1 bg-white rounded-[32px] border border-solid border-[#f0f0f2] shadow-[0_2px_8px_rgba(0,0,0,0.06)] relative flex-1 grow"
            >
              {item.icon}
            </button>
          );
        }

        if (item.type === "image") {
          return (
            <button
              key={`${item.label}-${index}`}
              type="button"
              aria-label={item.label}
              className="relative flex-1 grow"
            >
              <img
                className={item.className}
                alt={item.imgAlt}
                src={item.src}
              />
            </button>
          );
        }

        return (
          <button
            key={`${item.label}-${index}`}
            type="button"
            aria-label={item.label}
            className={item.className}
          >
            {item.icon}
          </button>
        );
      })}
    </nav>
  )
}
