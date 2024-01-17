import { colors } from "../../colors";
import styled from "styled-components/native";
import useMe from "../../hooks/useMe";
import { useNavigation } from "@react-navigation/core";
import Avatarimg from "../users/AvatarImg";
import { RootStackParamList, User } from "../../shared/shared.types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RoomItemNavigationProps = NativeStackNavigationProp<RootStackParamList>;

interface RoomItemProps {
  users: User[];
  unreadTotal: number;
  id: number;
}

const RoomContainer = styled.TouchableOpacity`
  width: 100%;
  padding: 15px 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const Column = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Data = styled.View``;
const UnreadDot = styled.View`
  width: 10px;
  border-radius: 5px;
  height: 10px;
  background-color: ${colors.blue};
`;
const Username = styled.Text`
  color: white;
  font-weight: 600;
  font-size: 16px;
`;
const UnreadText = styled.Text`
  color: white;
  margin-top: 2px;
  font-weight: 500;
`;

export default function RoomItem({ users, unreadTotal, id }: RoomItemProps) {
  const { data: meData } = useMe();

  const navigation = useNavigation<RoomItemNavigationProps>();

  const talkingTo = users.find(
    (user) => user.username !== meData?.me?.username
  );

  const goToRoom = () =>
    navigation.navigate("EachRoom", {
      id,
      talkingTo,
    });

  return (
    <RoomContainer onPress={goToRoom}>
      <Column>
        <Avatarimg avatarPath={talkingTo?.avatar} />
        <Data>
          <Username>{talkingTo?.username}</Username>
          <UnreadText>
            {unreadTotal} unread {unreadTotal === 1 ? "message" : "messages"}
          </UnreadText>
        </Data>
      </Column>
      <Column>{unreadTotal !== 0 ? <UnreadDot /> : null}</Column>
    </RoomContainer>
  );
}
