import gql from "graphql-tag";

gql`
  query seeRoom($id: Int!) {
    seeRoom(id: $id) {
      id
      messages {
        id
        payload
        user {
          id
          username
          avatar
        }
        read
      }
    }
  }
`;
