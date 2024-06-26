import { Request, Response } from "express";

const getPost = (req: Request, res: Response) => {
    res.send("post get");
};
const getPostById = (req: Request, res: Response) => {
    res.send("post get by id ");
};
const postPost = (req: Request, res: Response) => {
    res.send("post post");
};
const updatePost = (req: Request, res: Response) => {
    res.send("post put");
};
const updatePostById = (req: Request, res: Response) => {
    res.send("post put by id");
};
const deletePost = (req: Request, res: Response) => {
    res.send("post delete by id");
};
const deletePostById = (req: Request, res: Response) => {
    res.send("post delete by id");
};

export default {
    getPost,
    postPost,
    updatePost,
    deletePost,
    updatePostById,
    deletePostById,
    getPostById,
};
