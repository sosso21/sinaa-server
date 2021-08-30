const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  /**
   * Retrieve a record.
   *
   * @return {Object}
   */

  async findOne(ctx) {
    const { slug } = ctx.params;

    const entity = await strapi.services.category.findOne({ slug });
    return sanitizeEntity(entity, { model: strapi.models.category });
  },
  
  async add(ctx) {
      await strapi.query("category").delete( )

    const db = [
   { 
     name_fr: "Mécanique, hydraulique, pneumatique",
    name_en: "Mechanic, hydraulic, pneumatic",
     name_ar: "ميكانيك ، هيدروليك ، هوائيات",
       slug:"Mechanic",
   },
   {
   name_fr: "Electricité, électrotechnique",
    name_en: "Electricity, electrotechnic",
   name_ar: "الكهرباء والهندسة الكهربائية",
    slug:"Electricity",
   },
   {
   name_fr: "Automatismes",	
    name_en: "Automatisms",
   name_ar: "الأتمتة",
    slug:"Automatisms",
   },
   {
   name_fr: "Electronique",
    name_en: "Electronic",
   name_ar: "إلكترونيك",
    slug:"Electronic",
   },
   {
   name_fr: "Outils, Outillage",
    name_en: "Tools"	,
   name_ar: "أدوات ، معدات",
    slug:   "Tools",
   },
   {
   name_fr: "Mesure, analyse et capteurs",
    name_en: "Measurement, analysis and sensors",
   name_ar: "القياس والتحليل والحساسات",
    slug:  "Measurement",
   },
   {
   name_fr: "Chauffage, Froid et Climatisation",
    name_en: "Heating, Cooling and Air conditioning",
   name_ar: "التدفئة والتبريد والتكييف",
    slug:"Heating",
   },
   {
   name_fr: "Emballage, conditionnement",
    name_en: "Packing, packaging",
   name_ar: "التعبئة والتغليف",
    slug:  "Packing",
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
    slug:"Environment",
   },
   {
   name_fr:"Equipements de production",
    name_en:"Production equipments",
   name_ar:"معدات الإنتاج",
    slug: "Production" ,
   },
   {
   name_fr: "Equipements pour collectivités",
    name_en: "	Equipment for communities",
   name_ar: "معدات للمجمعات",
    slug: "Equipment",
   },
   ];

   for (let index = 0; index < db.length; index++) {
     const element = db[index];
     
    console.log( index, " \n -----\n \n \n \n ----")
     
    await strapi.query("category").create(element)
     
   } 


    console.log("-----\n \n \n \n ----")
    ctx.sent('<h1> END  </h1>')
 

  }
};
