import { Navigation } from '../../../types/types';
import { API_URL } from '@env';
import WriteSnapMSGTemplate from './WriteSnapMSGTemplate';

type Props = {
    navigation: Navigation;
  };

const WriteSnapMSG = ({ navigation}: Props) => {
    return (
      <WriteSnapMSGTemplate navigation={navigation} actionType='Write' editParams={{id:0,body:""}}></WriteSnapMSGTemplate>
    );
}

export default WriteSnapMSG;

