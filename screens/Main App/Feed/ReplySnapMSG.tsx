import { Navigation } from '../../../types/types';
import { API_URL } from '@env';
import WriteSnapMSGTemplate from './WriteSnapMSGTemplate';
import { RouteProp, useRoute } from '@react-navigation/native';

type Props = {
    navigation: Navigation;
};

type ReplySnapMSGRouteParams = {
    replyParams: {
        id: number
    }
}

const ReplySnapMSG = ({ navigation}: Props) => {
    const route = useRoute<RouteProp<Record<string, ReplySnapMSGRouteParams>, string>>()
    return (
        <WriteSnapMSGTemplate navigation={navigation} actionType='Reply' editParams={{id:0, body: ""}} replyParams={{id:route.params.replyParams.id}}></WriteSnapMSGTemplate>
      );
}

export default ReplySnapMSG;

