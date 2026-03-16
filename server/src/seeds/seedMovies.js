const AppDataSource = require('../data-source');
const Movie = require('../models/Movie');

//  title: String,
//     posterUrl: String,
//     genre: String,
//     description: String,
//     runtime: 150,
//     cast: [
//         {
//             name: String,
//             alias: String,
//             profilePicture: String
//         }
//     ]

const data = [
    {
        title: "O' Romeo",
        posterUrl: "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-image,i-discovery-catalog@@icons@@like_202006280402.png,lx-24,ly-617,w-29,l-end:l-text,ie-MTQ4SysgTGlrZXM%3D,fs-29,co-FFFFFF,ly-612,lx-70,pa-8_0_0_0,l-end/et00481091-qertnlkgqx-portrait.jpg",
        description: "What fate awaits a stone-hearted gangster, a bloodthirsty womaniser, when true love claims him, helpless and unguarded- a gang war that shakes the entire underworld and crime syndicate to their very roots.",
        runtime: 120,
        cast: [
            {
                name: "Shahid Kapoor",
                alias: "Ustara",
                profilePicture: "https://in.bmscdn.com/iedb/artist/images/website/poster/large/shahid-kapoor-2094-1680754317.jpg"
            },
            {
                name: "Tripti Dimri",
                alias: "Afsha",
                profilePicture: "https://in.bmscdn.com/iedb/artist/images/website/poster/large/tripti-dimri-1093177-01-06-2018-03-16-40.jpg"
            }
        ]
    },
    {
        title: "Assi",
        posterUrl: "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-image,i-discovery-catalog@@icons@@star-icon-202203010609.png,lx-24,ly-615,w-29,l-end:l-text,ie-OC44LzEwICAyLjNLKyBWb3Rlcw%3D%3D,fs-29,co-FFFFFF,ly-612,lx-70,pa-8_0_0_0,l-end/et00484699-uwkjarytxc-portrait.jpg",
        description: "What fate awaits a stone-hearted gangster, a bloodthirsty womaniser, when true love claims him, helpless and unguarded- a gang war that shakes the entire underworld and crime syndicate to their very roots.",
        runtime: 120,
        cast: [
            {
                name: "Shahid Kapoor",
                alias: "Ustara",
                profilePicture: "https://in.bmscdn.com/iedb/artist/images/website/poster/large/shahid-kapoor-2094-1680754317.jpg"
            },
            {
                name: "Tripti Dimri",
                alias: "Afsha",
                profilePicture: "https://in.bmscdn.com/iedb/artist/images/website/poster/large/tripti-dimri-1093177-01-06-2018-03-16-40.jpg"
            }
        ]
    },
    {
        title: "O' Romeo",
        posterUrl: "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-image,i-discovery-catalog@@icons@@star-icon-202203010609.png,lx-24,ly-615,w-29,l-end:l-text,ie-OC44LzEwICAxLjlLKyBWb3Rlcw%3D%3D,fs-29,co-FFFFFF,ly-612,lx-70,pa-8_0_0_0,l-end/et00471950-dewdxbtdyx-portrait.jpg",
        description: "What fate awaits a stone-hearted gangster, a bloodthirsty womaniser, when true love claims him, helpless and unguarded- a gang war that shakes the entire underworld and crime syndicate to their very roots.",
        runtime: 120,
        cast: [
            {
                name: "Shahid Kapoor",
                alias: "Ustara",
                profilePicture: "https://in.bmscdn.com/iedb/artist/images/website/poster/large/shahid-kapoor-2094-1680754317.jpg"
            },
            {
                name: "Tripti Dimri",
                alias: "Afsha",
                profilePicture: "https://in.bmscdn.com/iedb/artist/images/website/poster/large/tripti-dimri-1093177-01-06-2018-03-16-40.jpg"
            }
        ]
    },
    {
        title: "O' Romeo",
        posterUrl: "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-image,i-discovery-catalog@@icons@@star-icon-202203010609.png,lx-24,ly-615,w-29,l-end:l-text,ie-OC40LzEwICAxMDlLKyBWb3Rlcw%3D%3D,fs-29,co-FFFFFF,ly-612,lx-70,pa-8_0_0_0,l-end/et00401449-yvzgkbpdca-portrait.jpg",
        description: "What fate awaits a stone-hearted gangster, a bloodthirsty womaniser, when true love claims him, helpless and unguarded- a gang war that shakes the entire underworld and crime syndicate to their very roots.",
        runtime: 120,
        cast: [
            {
                name: "Shahid Kapoor",
                alias: "Ustara",
                profilePicture: "https://in.bmscdn.com/iedb/artist/images/website/poster/large/shahid-kapoor-2094-1680754317.jpg"
            },
            {
                name: "Tripti Dimri",
                alias: "Afsha",
                profilePicture: "https://in.bmscdn.com/iedb/artist/images/website/poster/large/tripti-dimri-1093177-01-06-2018-03-16-40.jpg"
            }
        ]
    }
]

async function main() {
    await AppDataSource.connect();
    // delete all the movies
    await Movie.deleteMany({});

    // insert the movies again
    await Movie.insertMany(data);
  

    // close the db connection
    await AppDataSource.disconnect();

    console.log('Data Seeded');
}

main();