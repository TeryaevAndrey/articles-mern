import React from "react";
import styled from "styled-components";
import BackBtn from "../../components/Forms/BackBtn/BackBtn";
import FormInput from "../../components/Forms/FormInput/FormInput";
import FormSubmit from "../../components/Forms/FormSubmit/FormSubmit";
import Message from "../../components/Message/Message";
import { useAppDispatch, useAppSelector } from "../../store/Hooks";
import { changeMessage } from "../../store/MainSlice";
import { useHttp } from "../../hooks/http.hook";
import { changeInputs } from "../../store/LoginSlice";
import { AuthContext } from "../../context/auth.context";
import { useNavigate } from "react-router-dom";

const AuthStyled = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 590px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 50px;
  font-weight: 600;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 30px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 30px;
  margin-top: 45px;
`;

function Auth() {
  const dispatch = useAppDispatch();
  const message = useAppSelector((state) => state.main.message);
  const inputsValue = useAppSelector((state) => state.login.inputsValue);
  const { request, error, loading } = useHttp();
  const auth = React.useContext(AuthContext);
  const navigate = useNavigate();

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      changeInputs({
        ...inputsValue,
        [event.target.name]: event.target.value,
      })
    );
  };

  React.useEffect(() => {
    dispatch(changeMessage(error));
  }, [error, dispatch]);

  const authHandler = async (event: React.MouseEvent<HTMLInputElement>) => {
    event.preventDefault();
    dispatch(changeMessage(""));

    try {
      interface ReadyData {
        name: string;
        password: string;
      }

      const readyData: ReadyData = {
        name: inputsValue.name,
        password: inputsValue.password,
      };

      const data = await request("/api/auth/login", "POST", readyData);

      auth.login(data.token, data.userId, data.name);

      dispatch(changeMessage(data.message));

      navigate("/profile");
    } catch (err: any) {
      dispatch(changeMessage(err.message));
    }
  };

  return (
    <AuthStyled>
      <Message text={message} />

      <BackBtn />
      <Title>????????</Title>
      <Form>
        <FormInput
          onChange={changeHandler}
          value={inputsValue.name}
          type="text"
          placeholder="?????? ????????????????????????"
          name="name"
        />
        <FormInput
          onChange={changeHandler}
          value={inputsValue.password}
          type="password"
          placeholder="????????????"
          name="password"
        />
        <FormSubmit
          disabled={loading}
          onClick={authHandler}
          type="submit"
          title="??????????"
        />
      </Form>
    </AuthStyled>
  );
}

export default Auth;
