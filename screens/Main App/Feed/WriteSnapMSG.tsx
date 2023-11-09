import { Navigation } from '../../../types/types';
import { API_URL } from '@env';
import WriteSnapMSGTemplate from './WriteSnapMSGTemplate';

type Props = {
    navigation: Navigation;
  };

const WriteSnapMSG = ({ navigation}: Props) => {
    return (

      <WriteSnapMSGTemplate navigation={navigation} actionType='Write' editParams={{id:0,body:"",privacy:false}} replyParams={{id:0}}></WriteSnapMSGTemplate>
    );
}

export default WriteSnapMSG;

