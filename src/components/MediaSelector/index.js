import React from 'react';
import { Modal, Button, Radio, Space, Avatar } from 'antd';
import { AntDesignOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import MediaUploader from './UploadMedium';
import MediaList from './MediaList';
import { getMedium } from '../../actions/media';
import ImagePlaceholder from '../ErrorsAndImage/PlaceholderImage';

function MediaSelector({ value = null, onChange, profile }) {
  const [show, setShow] = React.useState(false);
  const [selected, setSelected] = React.useState(null);
  const [tab, setTab] = React.useState('list');
  const dispatch = useDispatch();

  const medium = useSelector((state) => {
    return state.media.details[value] || null;
  });

  React.useEffect(() => {
    if (value) dispatch(getMedium(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Modal
        visible={show}
        onCancel={() => setShow(false)}
        closable={false}
        width={'800px'}
        footer={[
          <Button key="back" onClick={() => setShow(false)}>
            Return
          </Button>,
          <Button
            key="submit"
            type="primary"
            disabled={!selected}
            onClick={() => {
              setShow(false);
              onChange(selected.id);
            }}
          >
            {selected ? selected.name : null} Select
          </Button>,
        ]}
      >
        <Space direction="vertical">
          <Radio.Group buttonStyle="solid" value={tab} onChange={(e) => setTab(e.target.value)}>
            <Radio.Button value="list">List</Radio.Button>
            <Radio.Button value="upload">Upload</Radio.Button>
          </Radio.Group>
          {tab === 'list' ? (
            <MediaList onSelect={setSelected} selected={selected} />
          ) : tab === 'upload' ? (
            <MediaUploader />
          ) : null}
        </Space>
      </Modal>
      <Space direction="vertical">
        {medium ?  
        (<img src={medium.url?.proxy} alt={medium.alt_text} width="100%" />) 
        : 
          profile ?  <Avatar shape="square" size={300} icon={<AntDesignOutlined />} />  : <ImagePlaceholder width={230}/>
        }
        <Button onClick={() => setShow(true)}> Select</Button>
      </Space>
    </>      
  );
}

export default MediaSelector;