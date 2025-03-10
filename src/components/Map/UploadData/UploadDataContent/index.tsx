import { useState, useEffect, useRef } from "react";
import styles from "./styles.module.scss";
import { ArrowLeft } from "@phosphor-icons/react";
import { useUploadStore } from "../../../../store/useUploadStore";
import { useUIStore } from "../../../../store/useUIStore";

export default function UploadDataContent() {
  const { isTableVisible, updateIsTableVisible } = useUIStore();
  const { upload } = useUploadStore();

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = upload.length;

  const prevUploadLength = useRef(upload.length);

  useEffect(() => {
    if (upload.length > prevUploadLength.current) {
      setCurrentPage(upload.length);
    } else if (upload.length < prevUploadLength.current) {
      setCurrentPage(1);
    }
    prevUploadLength.current = upload.length;
  }, [upload]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(totalPages, 1));
    }
  }, [currentPage, totalPages]);

  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToPage = (page: number) => setCurrentPage(page);

  const currentItem = upload[currentPage - 1];

  useEffect(() => {
    if (upload.length < 1) {
      updateIsTableVisible(false);
    }
  }, [upload]);

  if (!currentItem || !isTableVisible) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={(e) => {
            e.stopPropagation();
            updateIsTableVisible(!isTableVisible);
          }}
        >
          <ArrowLeft size={18} />
        </button>
        <div className={styles.pagination} style={{ flexWrap: "wrap" }}>
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`${styles.paginationButton} ${
              currentPage === 1 ? styles.disabledButton : styles.activeButton
            }`}
          >
            Anterior
          </button>
          <button
            onClick={() => goToPage(1)}
            aria-current={currentPage === 1 ? "page" : undefined}
            className={`${styles.pageNumber} ${
              currentPage === 1 ? styles.currentPage : styles.pageButton
            }`}
          >
            1
          </button>

          {currentPage > 3 && totalPages > 5 && (
            <span className={styles.ellipsis}>...</span>
          )}

          {Array.from({ length: 3 }, (_, index) => {
            const startPage = Math.max(
              Math.min(currentPage - 1, totalPages - 3),
              2
            );
            const page = startPage + index;

            if (page >= totalPages) return null;

            const isActive = currentPage === page;
            return (
              <button
                key={page}
                onClick={() => goToPage(page)}
                aria-current={isActive ? "page" : undefined}
                className={`${styles.pageNumber} ${
                  isActive ? styles.currentPage : styles.pageButton
                }`}
              >
                {page}
              </button>
            );
          })}

          {currentPage < totalPages - 2 && totalPages > 5 && (
            <span className={styles.ellipsis}>...</span>
          )}

          {totalPages > 1 && (
            <button
              onClick={() => goToPage(totalPages)}
              aria-current={currentPage === totalPages ? "page" : undefined}
              className={`${styles.pageNumber} ${
                currentPage === totalPages
                  ? styles.currentPage
                  : styles.pageButton
              }`}
            >
              {totalPages}
            </button>
          )}

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`${styles.paginationButton} ${
              currentPage === totalPages
                ? styles.disabledButton
                : styles.activeButton
            }`}
          >
            Próximo
          </button>
        </div>
      </div>

      <div className={`${styles.content} scrollable-content`}>
        <div className={styles.tableContainer}>
          <div className={styles.titleContainer}>
            <h2 className={styles.title}>{currentItem.name}</h2>
            <p className={styles.sizeText}>Tamanho: {currentItem.size}</p>
          </div>
          {currentItem &&
          Object.keys(currentItem.feature[0].properties).length ? (
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHeader}>
                  {currentItem.feature.length > 0 &&
                    Object.keys(currentItem.feature[0].properties).map(
                      (key, keyIndex) => (
                        <th key={keyIndex} className={styles.tableHeaderCell}>
                          {key.replaceAll("�", "")}
                        </th>
                      )
                    )}
                </tr>
              </thead>
              <tbody>
                {currentItem.feature.map((feature, featureIndex) => (
                  <tr key={featureIndex} className={styles.tableRow}>
                    {Object.values(feature.properties).map(
                      (value, valueIndex) => (
                        <td key={valueIndex} className={styles.tableCell}>
                          {String(value || "N/A")}
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className={styles.noDataText}>Nenhum dado disponível.</p>
          )}
        </div>
      </div>
    </div>
  );
}
