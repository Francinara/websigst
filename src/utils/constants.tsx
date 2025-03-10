import { Cow, Fish, HandCoins, Plant, Plus } from "@phosphor-icons/react";
import { HiveOutlined } from "@mui/icons-material";

export enum RegistrationStatus {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected",
}

export enum LegendKeys {
  UrbanizedAreasVisible = "urbanizedAreasVisible",
  CommunitysVisible = "communitysVisible",
  DistrictsVisible = "districtsVisible",
  RoadBR232Visible = "roadBR232Visible",
  RoadPE320Visible = "roadPE320Visible",
  RoadPE365Visible = "roadPE365Visible",
  RoadPE390Visible = "roadPE390Visible",
  RoadPE418Visible = "roadPE418Visible",
  RoadPavedVisible = "roadPavedVisible",
  RoadUnpavedVisible = "roadUnpavedVisible",
  WatersVisible = "watersVisible",
  DrainageVisible = "drainagesVisible",
  SpringsVisible = "springsVisible",
  SubBasinVisible = "subBasinVisible",
  propertyDensityVisible = "propertyDensityVisible",
  propertyVisible = "propertyVisible",
}

export const legendItems = [
  {
    label: "Distritos",
    color: "#71370c",
    key: LegendKeys.DistrictsVisible,
    icon: "line",
  },
  {
    label: "Comunidades",
    color: "#57534e",
    key: LegendKeys.CommunitysVisible,
    icon: "text",
  },
  {
    label: "Nascentes",
    color: "#f1c309",
    key: LegendKeys.SpringsVisible,
    icon: "circle",
  },
  {
    label: "Massas D'água",
    color: "#071d41",
    key: LegendKeys.WatersVisible,
    icon: "line",
  },
  {
    label: "Drenagens",
    color: "#518592",
    key: LegendKeys.DrainageVisible,
    icon: "line",
  },
  {
    label: "Sub-bacias",
    color: "#75b7c3",
    key: LegendKeys.SubBasinVisible,
    icon: "line",
  },
];

export const roadItems = [
  { label: "BR-232", color: "blue", key: LegendKeys.RoadBR232Visible },
  { label: "PE-320", color: "darkred", key: LegendKeys.RoadPE320Visible },
  { label: "PE-365", color: "darkblue", key: LegendKeys.RoadPE365Visible },
  { label: "PE-390", color: "darkgreen", key: LegendKeys.RoadPE390Visible },
  { label: "PE-418", color: "brown", key: LegendKeys.RoadPE418Visible },
  { label: "Pavimentadas", color: "gray", key: LegendKeys.RoadPavedVisible },
  {
    label: "Não pavimentadas",
    color: "lightgray",
    key: LegendKeys.RoadUnpavedVisible,
  },
];

export enum activityMap {
  inicio = "Inicio",
  agricultura = "Agricultura",
  pecuaria = "Pecuária",
  aquicultura = "Aquicultura",
  apicultura = "Apicultura",
  artesanato = "Artesanato",
  outras_atividades = "Outras Atividades",
  recursos_hidricos = "Recursos Hídricos",
  dados_socioeconomicos = "Dados Socioeconômicos",
}

export enum activityAcess {
  agriculture = 1,
  livestock = 2,
  aquaculture = 3,
  craftsmanship = 4,
  beekeeping = 5,
  other_activities = 6,
}

export const icons = {
  activityMap: <Plant size={20} weight="bold" />,
  pecuaria: <Cow size={20} weight="bold" />,
  aquicultura: <Fish size={20} weight="bold" />,
  apicultura: <HiveOutlined sx={{ fontSize: 20 }} />,
  artesanato: <HandCoins size={20} weight="bold" />,
  outras_atividades: <Plus size={20} weight="bold" />,
};
