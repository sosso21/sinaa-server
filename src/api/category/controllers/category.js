"use strict";

/**
 *  category controller
 */

module.exports = {
  generate: async (ctx) => {
    let db = [{
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
        "format_profuct": "Product",
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


    const childDN = [{
        "slug": "electricityindustirelle",
        "name_en": "industrial electricity",
        "name_fr": "electricité industrielle",
        "name_ar": "trisiti ta3 louzin",
        "home": true,
        "format_profuct": "Product",
        parent_category_list: [{
          id: 2
        }]
      }, {
        "slug": "electricitybtp",
        "name_en": "electricity bullding",
        "name_fr": "electricité batiment",
        "name_ar": "trisiti ta3 batiman",
        "home": true,
        "format_profuct": "Product",
        parent_category_list: [{
          id: 2
        }]
      },

    ]

const dbProduct =[
  {
    "title": "Équipement de base du poste de travail du laboratoire d'électronique - reichelt magazine",
    "price": "5000",
    "status": "published",
    "description": "Suivez le guide reichelt ! Avec cet équipement électronique, chaque débutant peut rapidement devenir autonome. 1. Un éclairage optimisé pour le poste de travail.",
    "sector_product": "textiles",
    "adress": [
    {
    "id": 3,
    "wilaya": "Tizi Ouzou",
    "commune": "draa ben kheda"
    }
    ],
    "images": [
    {
    "id": 3,
    "image": "https://firebasestorage.googleapis.com/v0/b/sinaa-fr.appspot.com/o/images%2F1643506506257_image_2022-01-30_023254.png?alt=media&token=3c14e2be-2c65-4ea4-8a1a-ddc430d84eb9"
    }
    ],
    "emails": [
    {
    "id": 3,
    "email": "Vincenza_Klocko@albertha.nam",
    "view": null
    }
    ], 
    "author": {
    "id": 1,
    },
    "category": {
    "id": 16
    },
    
    
  },
  {
    "title": "Les critères pour choisir un meilleur matériel électrique",
    "price": "3999",
    "status": "published",
    "description": "Les critères pour choisir un meilleur matériel électrique",
    "sector_product": "others",
    "adress": [
    {
    "id": 2,
    "wilaya": "Alger",
    "commune": "daily"
    }
    ],
    "images": [
    {
    "id": 2,
    "image": "https://firebasestorage.googleapis.com/v0/b/sinaa-fr.appspot.com/o/images%2F1643505836447_image_2022-01-30_022123.png?alt=media&token=0fbd2174-0020-47bc-93fd-21beda660c36"
    }
    ],
    "emails": [
    {
    "id": 2,
    "email": "Vincenza_Klocko@albertha.nam",
    "view": null
    }
    ], 
    "author": {
    "id": 1, 
    }, 
    "category": {
    "id": 15, 
    }, 

  },
  {
"title": " 123RF Le Matériel électrique Sur Un Plan Banque D'Images Et Photos Libres De Droits. Image",
"price": 2000,
"sector_product": "social_health",
"description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\n\nWhy do we use it?\nIt is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).\n\n\nWhere does it come from?",
"adress": [
{
"id": 1,
"wilaya": "Alger",
"commune": "herrach"
}
],
"images": [
{
"id": 1,
"image": "https://firebasestorage.googleapis.com/v0/b/sinaa-fr.appspot.com/o/images%2F1643503982805_image_2022-01-30_015302.png?alt=media&token=2baca3c5-1235-4b2a-8b93-6bb55071ba28"
}
],
"emails": [
{
"id": 1,
"email": "Preston_Hudson@blaise.dss",
"view": null
}
],
"author": {
"id": 1,
},
"category": {
"id": 16,
},
  }
]


    const allformat_profuct = [
      "Service",
      "Formation",
      "Job",
      "Item_and_Equipment",
      "Product",
      "Transport",
      "Divers",
    ];


    const get_random = (items) => {
      return items[Math.floor(Math.random() * items.length)];
    }
    db = db.map(i => {
      return {
        ...i,
        work_proposalm: "none",
        format_profuct: (!!i.format_profuct ? i.format_profuct : get_random(allformat_profuct))
      }
    })
    const generate = await strapi.db
      .query("api::category.category")
      .createMany({
        data: db
      });
      await strapi.db
      .query("api::category.category")
      .createMany({
        data: childDN
      });

      
      await strapi.db
      .query("api::client.client")
      .createMany({
        data: [
          {
            firstname:"John",
            lastname:"Doe",
            username:"hermesDEv",
            email:"wolfmarketingpro@gmail.com",
            pass:"$2a$10$pziS/09PD7Rha9FQyAJE6.go9sqNmA3ui5hS6qZ8i9Qmb5L8AEGb2",
            status:"confirmed"
          }
        ]
      });

      
      await strapi.db
      .query("api::product.product")
      .createMany({
        data: dbProduct
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
