import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { TitleFilter } from "../../App";
import ArticleBriefly from "../../components/ArticlePost/ArticlePost";
import Header from "../../components/Header/Header";
import Loader from "../../components/Loader/Loader";
import ScrollBtn from "../../components/ScrollBtn/ScrollBtn";
import Search from "../../components/Search/Search";
import { AuthContext } from "../../context/auth.context";
import { Post } from "../../interfaces";
import { useAppDispatch, useAppSelector } from "../../store/Hooks";
import { changeValue } from "../../store/SearchSlice";
import { Articles } from "../Main/Main";

function Profile() {
  const [allPosts, setAllPosts] = React.useState<Post[]>([]);
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [currentPage, setCurrentPage] = React.useState<number>(0);
  const [fetching, setFetching] = React.useState<boolean>(true);
  const [totalCount, setTotalCount] = React.useState<number>(0);
  const searchValue = useAppSelector((state) => state.search.searchValue);
  const limitCount: number = 3;
  const navigate = useNavigate();
  const auth = React.useContext(AuthContext);
  const dispatch = useAppDispatch();

  const scrollHandler = React.useCallback(
    (e: any) => {
      if (
        e.target.documentElement.scrollHeight -
          (e.target.documentElement.scrollTop + window.innerHeight) <
          100 &&
        posts.length < totalCount
      ) {
        setFetching(true);
      }
    },
    [posts.length, totalCount]
  );

  const changeSearchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeValue(event.target.value));
  };

  React.useEffect(() => {
    if (fetching) {
      setLoading(true);

      axios
        .get(`/api/posts/userPosts?limit=${limitCount}&page=${currentPage}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        })
        .then((res) => {
          setTotalCount(res.data.total);
          setPosts([...posts, ...res.data.posts]);
          setCurrentPage((prev) => prev + 1);

          setLoading(false);
        })
        .finally(() => setFetching(false));
    }
  }, [auth.token, fetching]);

  React.useEffect(() => {
    axios
      .get("/api/posts/userPosts", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => setAllPosts(res.data.posts))
      .catch((err) =>
        alert(err.response.data.message + " ?????????????????????? ?? ??????????????")
      );
  }, []);

  React.useEffect(() => {
    document.addEventListener("scroll", scrollHandler);
    return function () {
      document.removeEventListener("scroll", scrollHandler);
    };
  }, [scrollHandler]);

  const resultPosts = posts.map((post: Post) => {
    const text = post.text.slice(0, 100) + "...";
    const date = new Date(post.date).toLocaleDateString();

    if (!post.banner) {
      return (
        <ArticleBriefly
          onClick={() => navigate(`/api/posts/${post._id}`)}
          title={post.title}
          text={text}
          date={date}
          key={post._id}
          isAuth={true}
          _id={post._id}
          deleteHandler={(event) => deleteHandler(event, post._id)}
        />
      );
    }

    return (
      <ArticleBriefly
        onClick={() => navigate(`/api/posts/${post._id}`)}
        banner={`http://localhost:3000/${post.banner}`}
        title={post.title}
        text={text}
        date={date}
        key={post._id}
        isAuth={true}
        _id={post._id}
        deleteHandler={(event) => deleteHandler(event, post._id)}
      />
    );
  });

  const filterPosts = allPosts.filter((post: Post) => {
    return post.title.toLowerCase().includes(searchValue.toLowerCase());
  });

  const deleteHandler = (event: React.MouseEvent, id: string | undefined) => {
    event.stopPropagation();

    axios
      .delete(`/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => alert(res.data.message))
      .catch((err) => alert(err.response.data.message));

    setPosts((prev: Post[]) => prev.filter((post: Post) => post._id !== id));
  };

  return (
    <>
      <Header />
      <Articles>
        <TitleFilter>?????? ????????????</TitleFilter>
        <Search
          onChange={changeSearchHandler}
          value={searchValue}
          width={"230px"}
        />
        {searchValue.length > 0
          ? filterPosts.map((post: Post) => {
              const text = post.text.slice(0, 100) + "...";
              const date = new Date(post.date).toLocaleDateString();

              if (!post.banner) {
                return (
                  <ArticleBriefly
                    onClick={() => navigate(`/api/posts/${post._id}`)}
                    title={post.title}
                    text={text}
                    date={date}
                    key={post._id}
                    deleteHandler={(event) => deleteHandler(event, post._id)}
                  />
                );
              }

              return (
                <ArticleBriefly
                  onClick={() => navigate(`/api/posts/${post._id}`)}
                  banner={`http://localhost:3000/${post.banner}`}
                  title={post.title}
                  text={text}
                  date={date}
                  key={post._id}
                  deleteHandler={(event) => deleteHandler(event, post._id)}
                />
              );
            })
          : resultPosts && resultPosts}

        {resultPosts.length === 0 && <span>???????? ?????? ???????????? ??????...</span>}
        {loading && <Loader />}
      </Articles>
      <ScrollBtn />
    </>
  );
}

export default Profile;
