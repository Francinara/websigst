// import { useState, useEffect, useMemo } from "react";
// import { MapContainer, TileLayer } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import useMapa from "../../hooks/useMapa";
// import {
//   BeneficiarioProps,
//   PropertyProps,
//   WaterResourceProps,
// } from "../../contexts/MapContext/types";
// import { PropertyLayer } from "./PropertyLayer";
// import { Link } from "react-router-dom";
import { Navbar } from "../../components/Navbar";
import styles from "./styles.module.scss";
// import { activityOptions, customStyles } from "../temporal-data";
// import { activityMap } from "../../utils/constants";
// import Select from "react-select";
// import { ProtectionLayer } from "../../components/Map/Layers/ProtectionLayer";

const Relatorio = () => {
  // const [loading, setLoading] = useState(false);
  // const [selectedOption, setSelectedOption] = useState(activityOptions[0]);
  // const [dados, setDados] = useState([]);
  // const [mapData, setMapData] = useState<PropertyProps[]>();
  // const [data, setData] = useState<PropertyProps[]>([]);
  // const [properties, setProperties] = useState<PropertyProps[]>([]);
  // const [dataWR, setDataWR] = useState<WaterResourceProps[]>([]);
  // const [waterResouces, setWaterResouces] = useState<WaterResourceProps[]>([]);
  // const [dataBeneficiario, setDataBeneficiario] = useState<BeneficiarioProps[]>(
  //   []
  // );
  // const [beneficiarios, setBeneficiarios] = useState<BeneficiarioProps[]>([]);
  // const {
  //   listProperty,
  //   listProductiveActivityByActivity,
  //   listWaterResouces,
  //   listBeneficiario,
  // } = useMapa();
  // useEffect(() => {
  //   // Simulação de carregamento de dados (substituir por API real)
  //   const dadosMock = [
  //     {
  //       distrito: "A",
  //       agricultura: 3,
  //       pecuaria: 2,
  //       familiasCredito: 120,
  //       arrecadacao: 50000,
  //       producao: 300,
  //       area: 150,
  //       rendaMedia: 2000,
  //     },
  //     {
  //       distrito: "B",
  //       agricultura: 2,
  //       pecuaria: 1,
  //       familiasCredito: 80,
  //       arrecadacao: 30000,
  //       producao: 200,
  //       area: 120,
  //       rendaMedia: 1800,
  //     },
  //     {
  //       distrito: "B",
  //       agricultura: 2,
  //       pecuaria: 1,
  //       familiasCredito: 80,
  //       arrecadacao: 30000,
  //       producao: 200,
  //       area: 120,
  //       rendaMedia: 1800,
  //     },
  //     {
  //       distrito: "B",
  //       agricultura: 2,
  //       pecuaria: 1,
  //       familiasCredito: 80,
  //       arrecadacao: 30000,
  //       producao: 200,
  //       area: 120,
  //       rendaMedia: 1800,
  //     },
  //     {
  //       distrito: "B",
  //       agricultura: 2,
  //       pecuaria: 1,
  //       familiasCredito: 80,
  //       arrecadacao: 30000,
  //       producao: 200,
  //       area: 120,
  //       rendaMedia: 1800,
  //     },
  //     {
  //       distrito: "B",
  //       agricultura: 2,
  //       pecuaria: 1,
  //       familiasCredito: 80,
  //       arrecadacao: 30000,
  //       producao: 200,
  //       area: 120,
  //       rendaMedia: 1800,
  //     },
  //     {
  //       distrito: "B",
  //       agricultura: 2,
  //       pecuaria: 1,
  //       familiasCredito: 80,
  //       arrecadacao: 30000,
  //       producao: 200,
  //       area: 120,
  //       rendaMedia: 1800,
  //     },
  //     {
  //       distrito: "B",
  //       agricultura: 2,
  //       pecuaria: 1,
  //       familiasCredito: 80,
  //       arrecadacao: 30000,
  //       producao: 200,
  //       area: 120,
  //       rendaMedia: 1800,
  //     },
  //     {
  //       distrito: "B",
  //       agricultura: 2,
  //       pecuaria: 1,
  //       familiasCredito: 80,
  //       arrecadacao: 30000,
  //       producao: 200,
  //       area: 120,
  //       rendaMedia: 1800,
  //     },
  //     {
  //       distrito: "B",
  //       agricultura: 2,
  //       pecuaria: 1,
  //       familiasCredito: 80,
  //       arrecadacao: 30000,
  //       producao: 200,
  //       area: 120,
  //       rendaMedia: 1800,
  //     },
  //     {
  //       distrito: "B",
  //       agricultura: 2,
  //       pecuaria: 1,
  //       familiasCredito: 80,
  //       arrecadacao: 30000,
  //       producao: 200,
  //       area: 120,
  //       rendaMedia: 1800,
  //     },
  //     {
  //       distrito: "B",
  //       agricultura: 2,
  //       pecuaria: 1,
  //       familiasCredito: 80,
  //       arrecadacao: 30000,
  //       producao: 200,
  //       area: 120,
  //       rendaMedia: 1800,
  //     },
  //   ];
  //   setDados(dadosMock);
  // }, []);
  // useEffect(() => {
  //   async function fetchProperties() {
  //     const propertieRequests = await listProperty();
  //     setProperties(propertieRequests);
  //     setData(propertieRequests);
  //     setMapData(propertieRequests);
  //     const waterResourceRequests = await listWaterResouces();
  //     setDataWR(waterResourceRequests);
  //     const beneficiarioRequests = await listBeneficiario();
  //     setDataBeneficiario(beneficiarioRequests);
  //     setBeneficiarios(beneficiarioRequests);
  //   }
  //   fetchProperties();
  // }, [
  //   listProperty,
  //   listProductiveActivityByActivity,
  //   listWaterResouces,
  //   listBeneficiario,
  // ]);
  // const field = "activity";
  // const processActivityData = (data: PropertyProps[]) => {
  //   const activityLabels: Record<string, string> = {
  //     agricultura: "Agricultura",
  //     pecuaria: "Pecuária",
  //     aquicultura: "Aquicultura",
  //     artesanato: "Artesanato",
  //     apicultura: "Apicultura",
  //     outras_atividades: "Outras Atividades",
  //     sem_atividade: "Sem Atividade",
  //   };
  //   return data.flatMap((item) => {
  //     const activities = Object.keys(activityLabels).filter(
  //       (key) => key !== "sem_atividade" && item[key as keyof PropertyProps]
  //     );
  //     return activities.length
  //       ? activities.map((activity) => ({
  //           ...item,
  //           activity: activityLabels[activity],
  //         }))
  //       : { ...item, activity: activityLabels["sem_atividade"] };
  //   });
  // };
  // const processBeneficiarioData = (data: BeneficiarioProps[]) => {
  //   return data.map((beneficiario) => {
  //     const matchingProperty = properties.find(
  //       (item) => beneficiario.id === item.beneficiario_id
  //     );
  //     if (matchingProperty) {
  //       return {
  //         ...beneficiario,
  //         propriedade_id: matchingProperty.id,
  //         distrito: matchingProperty.distrito,
  //         tipo_credito_rural: beneficiario.tipo_credito_rural ?? "não possui",
  //       };
  //     }
  //     return {
  //       ...beneficiario,
  //       tipo_credito_rural: beneficiario.tipo_credito_rural ?? "não possui",
  //     };
  //   });
  // };
  // const processedData = useMemo(
  //   () => processActivityData(properties),
  //   [properties]
  // );
  // const processedDataBeneficiarios = useMemo(
  //   () => processBeneficiarioData(beneficiarios),
  //   [beneficiarios]
  // );
  return (
    <>
      <div className={styles.container}>
        <Navbar />
        {/* <div className={styles.temporalDataContainer}>
          <nav className={styles.temporalDataNavbar}>
            {activityOptions.map((option) => (
              <div
                key={option.value}
                onClick={() =>
                  setSelectedOption(
                    option as {
                      value: activityMap;
                      label: JSX.Element;
                      icon: JSX.Element;
                    }
                  )
                }
                className={
                  selectedOption.value === option.value
                    ? `${styles.option} ${styles.active}`
                    : styles.option
                }
              >
                {option.label}
              </div>
            ))}
            <div className="overflow-hidden rounded border border-gray-300 mt-3">
              <div className="bg-stone-100 flex justify-end py-1 px-2 text-green-700">
                <Link to="/">Ver mapa </Link>
              </div>
              <MapContainer
                center={[-8.072111864818805, -38.38523229242289]}
                zoom={9}
                style={{ height: "300px", width: "300px" }}
                dragging={false}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
                touchZoom={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <PropertyLayer properties={properties} />
                <ProtectionLayer />
              </MapContainer>
            </div>
          </nav>
          <div className={styles.temporalDataContent}>
            <nav className={styles.temporalDataSelect}>
              <Select
                options={activityOptions}
                value={selectedOption}
                onChange={(option) =>
                  setSelectedOption(
                    option as {
                      value: activityMap;
                      label: JSX.Element;
                      icon: JSX.Element;
                    }
                  )
                }
                styles={customStyles}
                isSearchable={false}
              />
            </nav>
            <div className={styles.temporalDataSection}>
              <header>
                <h1>Visão Geral - {selectedOption.value}</h1>
              </header>
              <div className={styles.content}>
                {loading && (
                  <div className={styles.loadingOverlay}>
                    <div className={styles.loaderCircle}></div>
                  </div>
                )}
                <table className="w-full border-collapse border border-stone-200">
                  <thead>
                    <tr className="bg-stone-100">
                      <th className="border p-2" rowSpan={2}>
                        Distrito
                      </th>
                      <th className="border p-2" rowSpan={2}>
                        Nº de Propriedades
                      </th>
                      <th className="border p-2" colSpan={2}>
                        Atividades
                      </th>
                      <th className="border p-2" rowSpan={2}>
                        Famílias com Crédito
                      </th>
                      <th className="border p-2" rowSpan={2}>
                        Arrecadação
                      </th>
                      <th className="border p-2" rowSpan={2}>
                        Produção
                      </th>
                      <th className="border p-2" rowSpan={2}>
                        Área (ha)
                      </th>
                      <th className="border p-2" rowSpan={2}>
                        Renda Média
                      </th>
                    </tr>
                    <tr className="bg-stone-100">
                      <th className="border p-2">Agricultura</th>
                      <th className="border p-2">Pecuária</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ...new Set(data.map((property) => property.distrito)),
                    ].map((d, i) => (
                      <tr key={i} className="text-center border">
                        <td className="border p-2">{d}</td>
                        <td className="border p-2">
                          {properties.reduce((acc, item) => {
                            return acc + (item.distrito === d ? 1 : 0);
                          }, 0)}
                        </td>
                        <td className="border p-2">d.agricultura</td>
                        <td className="border p-2">d.pecuaria</td>
                        <td className="border p-2">
                          {processedDataBeneficiarios.reduce((acc, item) => {
                            return (
                              acc +
                              (item.distrito === d
                                ? item.credito_rural
                                  ? 1
                                  : 0
                                : 0)
                            );
                          }, 0)}
                        </td>
                        <td className="border p-2">
                          R$ d.arrecadacao.toLocaleString()
                        </td>
                        <td className="border p-2">d.producao ton</td>
                        <td className="border p-2">d.area ha</td>
                        <td className="border p-2">
                          R$
                          {(() => {
                            const valoresFiltrados =
                              processedDataBeneficiarios.filter(
                                (item) => item.distrito === d
                              );
                            const soma = valoresFiltrados.reduce(
                              (acc, item) => acc + item.renda_familiar,
                              0
                            );
                            const media =
                              valoresFiltrados.length > 0
                                ? soma / valoresFiltrados.length
                                : 0;
                            return media.toFixed(2); // Opcional: limitar a 2 casas decimais
                          })()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div> */}
      </div>
      {/* <div className="">
        <Navbar />
        <div className="flex pt-[100px]">
          <div className="flex flex-col">
            <div>Inicio</div>
            <div>Inicio</div>
            <div>Inicio</div>
            <div>Inicio</div>
            <div>Inicio</div>
            <div>Inicio</div>
            <h2 className="text-xl font-bold">Distribuição das Propriedades</h2>
            <div className="overflow-hidden rounded border border-gray-300 m-1">
              <MapContainer
                center={[-8.072111864818805, -38.38523229242289]}
                zoom={9}
                style={{ height: "400px", width: "400px" }}
                dragging={false}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
                touchZoom={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <PropertyLayer properties={properties} />
              </MapContainer>
              <div className="bg-stone-100 flex justify-end p-1">
                <Link to="/">Ver mapa </Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-1">
            <h1 className="text-2xl font-bold mb-4 ">Visão Geral</h1>
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2" rowSpan={2}>
                    Distrito
                  </th>
                  <th className="border p-2" colSpan={2}>
                    Atividades
                  </th>
                  <th className="border p-2" rowSpan={2}>
                    Famílias com Crédito
                  </th>
                  <th className="border p-2" rowSpan={2}>
                    Arrecadação
                  </th>
                  <th className="border p-2" rowSpan={2}>
                    Produção
                  </th>
                  <th className="border p-2" rowSpan={2}>
                    Área (ha)
                  </th>
                  <th className="border p-2" rowSpan={2}>
                    Renda Média
                  </th>
                </tr>
                <tr className="bg-gray-100">
                  <th className="border p-2">Agricultura</th>
                  <th className="border p-2">Pecuária</th>
                </tr>
              </thead>
              <tbody>
                {dados.map((d, i) => (
                  <tr key={i} className="text-center border">
                    <td className="border p-2">{d.distrito}</td>
                    <td className="border p-2">{d.agricultura}</td>
                    <td className="border p-2">{d.pecuaria}</td>
                    <td className="border p-2">{d.familiasCredito}</td>
                    <td className="border p-2">
                      R$ {d.arrecadacao.toLocaleString()}
                    </td>
                    <td className="border p-2">{d.producao} ton</td>
                    <td className="border p-2">{d.area} ha</td>
                    <td className="border p-2">
                      R$ {d.rendaMedia.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h2 className="text-xl font-bold mt-6">Arrecadação por Distrito</h2>
            <div>BarChart</div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default Relatorio;
