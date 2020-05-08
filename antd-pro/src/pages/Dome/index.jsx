
import { Table, Divider, Tag, Tooltip, Button, Modal, Input, Icon } from 'antd';
import Highlighter from 'react-highlight-words';
import React, { Component } from 'react'
import axios from 'axios';
export default class index extends Component {
  state = {
    data: [],
    visible: false,
    dataChild: []
  }
  componentDidMount() {
    axios('http://www.mocky.io/v2/5ea28891310000358f1ef182', { method: 'POST' })
      .then((res) => {
        this.setState({
          data: res.data.apis
        }, () => {
          console.log(this.state.data, 'data')
        })
      })
  }
  onModle = (e) => {
    this.setState({
      visible: true,
      dataChild: e
    });

  }
  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };
  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };
  onVal = ({ setSelectedKeys, selectedKeys, confirm, clearFilters }, dataIndex) => {
    return (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          筛选
        </Button>
      </div>
    )
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => this.onVal({ setSelectedKeys, selectedKeys, confirm, clearFilters }, dataIndex),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
          text.toString()
        ),

  });

  render() {
    const columns = [
      {
        title: '名字列',
        dataIndex: 'name',
        render: text => <a>{text}</a>,
      },
      {
        title: '描述列',
        dataIndex: 'description',
        render: description => <Tooltip placement="top" title={description}>
          <span style={{
            width: '180px',
            display: 'block',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
          }}>{description}</span>
        </Tooltip>
      },
      {
        title: '图片列',
        dataIndex: 'image',
        render: image => <img src={image} alt="alt" style={{ width: 180 }} />
      },
      {
        title: '链接列',
        dataIndex: 'humanURL',
        render: humanURL => <a href={humanURL} target="_blank">链接地址</a>

      },
      {
        title: 'Tags',
        dataIndex: 'tags',
        render: tags => (
          <span>
            {tags.map(tag => {
              let color = tag.length > 5 ? 'geekblue' : 'green';
              if (tag === 'loser') {
                color = 'volcano';
              }
              return (
                <Tag color={color} key={tag}>
                  {tag}
                </Tag>
              );
            })}
          </span>
        ),
        ...this.getColumnSearchProps('tags'),
      },
      {
        title: '属性类',
        dataIndex: 'properties',
        render: properties => <Button onClick={() => this.onModle(properties)}>点击</Button>
      }

    ];
    const columnsChild = [
      {
        title: 'type',
        dataIndex: 'type',
      },
      {
        title: 'url',
        dataIndex: 'url',
        render: url => <a>{url}</a>,
      },
    ]
    return (
      <div>
        <Table columns={columns} dataSource={this.state.data} />
        <Modal
          title="属性"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          style={{
            maxWidth: '1000px',
            minWidth: '1000px'
          }}
        >
          <Table columns={columnsChild} dataSource={this.state.dataChild} />
        </Modal>
      </div>
    )
  }
}
