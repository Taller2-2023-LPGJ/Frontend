import { Navigation } from '../../../types/types';
import { API_URL } from '@env';
import WriteSnapMSGTemplate from './WriteSnapMSGTemplate';
import { RouteProp, useRoute } from '@react-navigation/native';

type Props = {
    navigation: Navigation;
};

type EditSnapMSGRouteParams = {
    editParams: {
        id: number,
        body: string,
    }
}

const EditSnapMSG = ({ navigation}: Props) => {
    const route = useRoute<RouteProp<Record<string, EditSnapMSGRouteParams>, string>>()
    return (
        <WriteSnapMSGTemplate navigation={navigation} actionType='Edit' editParams={{id:route.params.editParams.id, body:route.params.editParams.body}} replyParams={{id:0}}></WriteSnapMSGTemplate>
      );
}

export default EditSnapMSG;

