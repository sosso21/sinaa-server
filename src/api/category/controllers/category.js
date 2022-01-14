"use strict";

/**
 *  category controller
 */

module.exports = {
  generate: async (ctx) => {
    let db = [
      {
        name_fr: "Mécanique, hydraulique, pneumatique",
        name_en: "Mechanic, hydraulic, pneumatic",
        name_ar: "ميكانيك ، هيدروليك ، هوائيات",
        slug: "Mechanic",
      },
      {
        name_fr: "Electricité, électrotechnique",
        name_en: "Electricity, electrotechnic",
        name_ar: "الكهرباء والهندسة الكهربائية",
        slug: "Electricity",
      },
      {
        name_fr: "Automatismes",
        name_en: "Automatisms",
        name_ar: "الأتمتة",
        slug: "Automatisms",
      },
      {
        name_fr: "Electronique",
        name_en: "Electronic",
        name_ar: "إلكترونيك",
        slug: "Electronic",
      },
      {
        name_fr: "Outils, Outillage",
        name_en: "Tools",
        name_ar: "أدوات ، معدات",
        slug: "Tools",
      },
      {
        name_fr: "Mesure, analyse et capteurs",
        name_en: "Measurement, analysis and sensors",
        name_ar: "القياس والتحليل والحساسات",
        slug: "Measurement",
      },
      {
        name_fr: "Chauffage, Froid et Climatisation",
        name_en: "Heating, Cooling and Air conditioning",
        name_ar: "التدفئة والتبريد والتكييف",
        slug: "Heating",
      },
      {
        name_fr: "Emballage, conditionnement",
        name_en: "Packing, packaging",
        name_ar: "التعبئة والتغليف",
        slug: "Packing",
      },
      {
        name_fr: "Logistique et manutention",
        name_en: "Logistics and charging",
        name_ar: "	النقل والتحميل",
        slug: "Logistics",
      },
      {
        name_fr: "Plasturgie",
        name_en: "Plastics",
        name_ar: "بلاستيك",
        slug: "Plastics",
      },
      {
        name_fr: "Chimie, laboratoires et santé",
        name_en: "Chemistry, laboratories and health",
        name_ar: "الكيمياء والمختبرات والصحة",
        slug: "Chemistry",
      },
      {
        name_fr: "Environnement",
        name_en: "Environment, energy",
        name_ar: "البيئة والطاقة",
        slug: "Environment",
      },
      {
        name_fr: "Equipements de production",
        name_en: "Production equipments",
        name_ar: "معدات الإنتاج",
        slug: "Production",
      },
      {
        name_fr: "Equipements pour collectivités",
        name_en: "	Equipment for communities",
        name_ar: "معدات للمجمعات",
        slug: "Equipment",
      },
    ];
    const allformat_profuct = [
      "Service",
      "Formation",
      "Job",
      "Item_and_Equipment",
      "Product",
      "Transport",
      "Divers",
    ];
    const get_random = (items) =>{
      return items[Math.floor(Math.random() * items.length)];}
      db = db.map(i=> {
          return {...i,work_proposalm:"none", format_profuct: get_random(allformat_profuct)}
      })
    const generate = await strapi.db
      .query("api::category.category")
      .createMany({
        data:db
      });
    ctx.send(generate);
  },
  find: async (ctx) => {
    ctx.send(
      await strapi.db.query("api::category.category").findMany({
        populate: true,
      })
    );
  },
};

/*
[
{
"id": 1,
"slug": "mecanic",
"name_en": "mecanic",
"name_fr": "mécanique",
"name_ar": "mikanik",
"home": true,
"format_profuct": "Service",
"createdAt": "2022-01-11T14:41:33.314Z",
"updatedAt": "2022-01-11T14:41:33.314Z",
"publishedAt": null,
"parent": [],
"children": [],
"sliders": [],
"products": [],
"suggestion": [],
"suggest": [],

*/
