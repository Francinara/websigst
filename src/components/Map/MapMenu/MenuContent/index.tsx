import { useEffect, useRef, useState } from "react";
import {
  Plant,
  Cow,
  Fish,
  HandCoins,
  Plus,
  PencilRuler,
  House,
  UploadSimple,
  X,
} from "@phosphor-icons/react";
import { HiveOutlined } from "@mui/icons-material";

import Select from "react-select";

import { MenuIcon } from "./MenuIcon";
import styles from "./styles.module.scss";
import { toast } from "react-toastify";
import { extractShapes } from "../../../../utils/shapefile";
import { IconButton } from "../../../ui/IconButton";
import { Tooltip } from "@mui/material";
import { activityMap } from "../../../../utils/constants";
import { useUploadStore } from "../../../../store/useUploadStore";
import { useUIStore } from "../../../../store/useUIStore";

export const activityOptions = [
  {
    value: activityMap.inicio,
    label: (
      <div className={styles.activityOptions}>
        <House size={20} weight="bold" /> {activityMap.inicio}
      </div>
    ),
    icon: <House size={22} weight="bold" />,
  },
  {
    value: activityMap.agricultura,
    label: (
      <div className={styles.activityOptions}>
        <Plant size={20} weight="bold" /> {activityMap.agricultura}
      </div>
    ),
    icon: <Plant size={22} weight="bold" />,
  },
  {
    value: activityMap.pecuaria,
    label: (
      <div className={styles.activityOptions}>
        <Cow size={20} weight="bold" /> {activityMap.pecuaria}
      </div>
    ),
    icon: <Cow size={22} weight="bold" />,
  },
  {
    value: activityMap.aquicultura,
    label: (
      <div className={styles.activityOptions}>
        <Fish size={20} weight="bold" /> {activityMap.aquicultura}
      </div>
    ),
    icon: <Fish size={22} weight="bold" />,
  },
  {
    value: activityMap.apicultura,
    label: (
      <div className={styles.activityOptions}>
        <HiveOutlined sx={{ fontSize: 20 }} /> {activityMap.apicultura}
      </div>
    ),
    icon: <HiveOutlined sx={{ fontSize: 22 }} />,
  },
  {
    value: activityMap.artesanato,
    label: (
      <div className={styles.activityOptions}>
        <HandCoins size={20} weight="bold" /> {activityMap.artesanato}
      </div>
    ),
    icon: <HandCoins size={22} weight="bold" />,
  },
  {
    value: activityMap.outras_atividades,
    label: (
      <div className={styles.activityOptions}>
        <Plus size={20} weight="bold" /> {activityMap.outras_atividades}
      </div>
    ),
    icon: <Plus size={22} weight="bold" />,
  },
  // {
  //   value: activityMap.recursos_hidricos,
  //   label: (
  //     <div className={styles.activityOptions}>
  //       <Drop size={20} weight="bold" /> {activityMap.recursos_hidricos}
  //     </div>
  //   ),
  //   icon: <Drop size={22} weight="bold" />,
  // },
  // {
  //   value: activityMap.dados_socioeconomicos,
  //   label: (
  //     <div className={styles.activityOptions}>
  //       <UsersThree size={20} weight="bold" />{" "}
  //       {activityMap.dados_socioeconomicos}
  //     </div>
  //   ),
  //   icon: <UsersThree size={22} weight="bold" />,
  // },
];

import { StylesConfig } from "react-select";

const customStyles: StylesConfig = {
  control: (provided) => ({
    ...provided,
    borderRadius: "4px",
    borderColor: "#e7e5e4",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#aaa",
    },
    width: "190px",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#78716c", // Cor do texto do placeholder
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#78716c", // Cor do texto selecionado
    fontWeight: "bold",
  }),
  option: (provided, state) => ({
    ...provided,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: state.isFocused ? "#fafaf9" : "#fff",
    color: "#78716c",
  }),
};

export default function MenuContent() {
  const {
    updateIsTableVisible,
    isDrawToolsVisible,
    updateIsDrawToolsVisible,
    activeOption,
    updateActiveOption,
  } = useUIStore();

  const { addUpload, removeUpload, upload } = useUploadStore();

  const [selectedOption, setSelectedOption] = useState(activeOption);
  const [isHovered, setIsHovered] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const uploadContainerRef = useRef<HTMLDivElement>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
    }
  }, [upload]);

  useEffect(() => {
    setSelectedOption(activeOption);
  }, [activeOption]);

  const handleIconClick = () => {
    if (upload.length === 0) {
      document.getElementById("file-input")?.click();
    }
    setIsHovered(!isHovered);
  };

  const handleIconOpenFile = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    document.getElementById("file-input")?.click();
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const fileSizeKB = (file.size / 1024).toFixed(2);
    const fileSizeMB = (parseFloat(fileSizeKB) / 1024).toFixed(2);
    const fileSize =
      fileSizeMB === "0.00" ? fileSizeKB + " KB" : fileSizeMB + " MB";
    const fileExtension = fileName.slice(fileName.lastIndexOf("."));

    if (fileExtension !== ".zip") {
      toast.error("Formato de arquivo inválido.");
      return;
    }

    try {
      const shapes = await extractShapes(e.target.files as FileList);
      if (shapes) {
        updateIsTableVisible(true);

        addUpload({
          name: file.name,
          feature: shapes as any,
          size: fileSize,
          editable: false,
        });
      }
    } catch (error) {
      console.error("Error extracting shapes:", error);
      return;
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleDeleteFile = (
    event: React.MouseEvent<HTMLButtonElement>,
    indexToDelete: number
  ) => {
    event.stopPropagation();

    removeUpload(indexToDelete);
  };

  // const handleUpdateFile = (
  //   event: React.MouseEvent<HTMLButtonElement>,
  //   indexToUpdate: number
  // ) => {
  //   event.stopPropagation();
  //   editUpload(indexToUpdate);
  // };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        uploadContainerRef.current &&
        !uploadContainerRef.current.contains(event.target as Node)
      ) {
        setIsHovered(false);
      }
    };
    document.addEventListener("mouseup", handleClickOutside);

    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        className={styles.menuContainer}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Select
          className={styles.select}
          classNamePrefix="scrollable"
          options={activityOptions}
          value={selectedOption}
          onChange={(option) => {
            const newValue = option as {
              value: activityMap;
              label: JSX.Element;
              icon: JSX.Element;
            };
            setSelectedOption(newValue);
            updateActiveOption(newValue);
          }}
          styles={customStyles}
          isSearchable={false}
        />

        <div className={styles.navContainer}>
          <div className={`${styles.iconBox} ${styles.data}`}>
            <MenuIcon
              tooltipTitle={activityOptions[0].value}
              tooltipPlace="right"
              icon={activityOptions[0].icon}
              onClick={() => updateActiveOption(activityOptions[0])}
              isActive={activeOption === activityOptions[0]}
            />
          </div>
          <div className={`${styles.iconBox} ${styles.data}`}>
            <MenuIcon
              tooltipTitle={activityOptions[1].value}
              icon={activityOptions[1].icon}
              onClick={() => updateActiveOption(activityOptions[1])}
              isActive={activeOption === activityOptions[1]}
            />
            <MenuIcon
              tooltipTitle={activityOptions[2].value}
              icon={activityOptions[2].icon}
              onClick={() => updateActiveOption(activityOptions[2])}
              isActive={activeOption === activityOptions[2]}
            />
            <MenuIcon
              tooltipTitle={activityOptions[3].value}
              icon={activityOptions[3].icon}
              onClick={() => updateActiveOption(activityOptions[3])}
              isActive={activeOption === activityOptions[3]}
            />
            <MenuIcon
              tooltipTitle={activityOptions[4].value}
              icon={activityOptions[4].icon}
              onClick={() => updateActiveOption(activityOptions[4])}
              isActive={activeOption === activityOptions[4]}
            />
            <MenuIcon
              tooltipTitle={activityOptions[5].value}
              icon={activityOptions[5].icon}
              onClick={() => updateActiveOption(activityOptions[5])}
              isActive={activeOption === activityOptions[5]}
            />
            <MenuIcon
              tooltipTitle={activityOptions[6].value}
              icon={activityOptions[6].icon}
              onClick={() => updateActiveOption(activityOptions[6])}
              isActive={activeOption === activityOptions[6]}
            />
          </div>
          {/* 
          <div className={`${styles.iconBox} ${styles.data}`}>
            <MenuIcon
              tooltipTitle={activityOptions[7].value}
              icon={activityOptions[7].icon}
              onClick={() => updateActiveOption(activityOptions[7])}
              isActive={activeOption === activityOptions[7]}
            />
            <MenuIcon
              tooltipTitle={activityOptions[8].value}
              icon={activityOptions[8].icon}
              onClick={() => updateActiveOption(activityOptions[8])}
              isActive={activeOption === activityOptions[8]}
            />
          </div> */}

          <div className={`${styles.iconBox} ${styles.tools}`}>
            <MenuIcon
              tooltipTitle={
                isDrawToolsVisible
                  ? "Ocultar Ferramentas de Desenho"
                  : "Exibir Ferramentas de Desenho"
              }
              icon={<PencilRuler size={22} weight="bold" />}
              onClick={() => updateIsDrawToolsVisible(!isDrawToolsVisible)}
              isActive={isDrawToolsVisible}
            />

            <MenuIcon
              tooltipTitle="Importar Camadas"
              icon={<UploadSimple size={22} weight="bold" />}
              onClick={handleIconClick}
              isActive={upload.length > 0 && isHovered}
            />
          </div>
        </div>
      </div>
      {upload.length > 0 && isHovered && (
        <div
          className={`${styles.uploadDisplay} ${isHovered ? styles.show : ""}`}
        >
          <div ref={uploadContainerRef} className={styles.uploadContainer}>
            <button
              className={styles.uploadButton}
              onClick={handleIconOpenFile}
            >
              Escolher Arquivo
            </button>

            <div
              ref={scrollableRef}
              className={`${styles.scrollableContent} scrollable-content`}
            >
              {upload.map((file, i) => {
                return (
                  <div key={i} className={styles.uploadItem}>
                    <Tooltip title={file.name} disableInteractive>
                      <div className={styles.fileName}>{file.name}</div>
                    </Tooltip>
                    <div className={styles.fileSize}>{file.size}</div>
                    <div className={styles.deleteButton}>
                      {/* {isDrawToolsVisible && (
                        <IconButton
                          onClick={() => handleUpdateFile(event, i)}
                          tooltipTitle="Editar"
                          icon={
                            <PencilSimple
                              size={16}
                              weight="bold"
                              color={file.editable ? "#006400" : "#78716c"}
                            />
                          }
                        />
                      )} */}
                      <IconButton
                        onClick={(event) => handleDeleteFile(event, i)}
                        tooltipTitle="Remover"
                        icon={<X size={16} weight="bold" />}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      <input
        id="file-input"
        type="file"
        accept=".zip"
        ref={inputRef}
        onChange={handleChange}
      />
    </>
  );
}
