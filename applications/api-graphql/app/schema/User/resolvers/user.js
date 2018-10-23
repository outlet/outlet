import withUser from './withUser';

export default withUser.createResolver(
  async (_, args, { userResource: user }) => {
    return user.toJSON();
  }
);
