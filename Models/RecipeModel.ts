import UserAPI from "../api/UserAPI";

export type Recipe = {
    _id: string;
    owner: string;
    title: string;
    description: string;
    ingredients: string[];
    steps: string[];
    imgUrl: string;
};

// title: string;
// ingredients: string[];
// description: string;
// steps: string[];
// owner: string;
