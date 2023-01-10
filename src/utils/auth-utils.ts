import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import _ from "lodash";
// import { UserModelType } from "../src/types/user/user.model.type";
import { Model } from "mongoose";
export const getSalt = async () => {
  return await bcrypt.genSalt();
};

export const getEncryptedPassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};


export const validatePassword = async (
  password: string,
  encrypedPassword: string
) => {
  return await bcrypt.compare(password, encrypedPassword);
};

export const createTokens = async (
  user: any,
  authTokenSecret: string,
  refreshTokenSecret: string,
  expireIn = "1m"
) => {
  const createToken = jwt.sign(
    {
      ..._.pick(user, ["_id", "name", "email"]),
    },
    authTokenSecret,
    {
      expiresIn: expireIn,
    }
  );

  const createRefreshToken = jwt.sign(
    {
      userId: _.pick(user, "_id"),
    },
    refreshTokenSecret,
    {
      expiresIn: "7d",
    }
  );

  return Promise.all([createToken, createRefreshToken]);
};

export const refreshTokens = async (
  refreshToken: string,
  model: typeof Model,
  SECRET: string,
  SECRET_2: string
) => {
  let userId = -1;
  try {
    const payload = jwt.decode(refreshToken);
    if (typeof payload !== "string" && payload) {
      userId = payload.user._id;
    }
  } catch (err) {
    return err;
  }

  if (!userId) {
    return {};
  }

  const user = await model.findOne({ _id: userId });

  if (!user) {
    return {};
  }

  try {
    jwt.verify(refreshToken, SECRET_2);
  } catch (err) {
    return err;
  }

  const [newToken, newRefreshToken] = await createTokens(
    user,
    SECRET,
    SECRET_2
  );
  const { password, ...others } = user;
  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user: others._doc,
  };
};