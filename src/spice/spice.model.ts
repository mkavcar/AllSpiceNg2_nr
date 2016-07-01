export class Spice {
    cookTime: number;
    description: string;
    directions: string;
    imageURL: string;
    ingredients: string;
    name: string;
    pinnedUsers: any;
    prepTime: number;
    servings: number;
    tags: string;
    timestamp: number;
    user: {
        name: string,
        profileImageURL: string,
        provider: string,
        uid: string
    };
    $key: string;
}