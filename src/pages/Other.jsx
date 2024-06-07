import React from 'react';
import BackButton from '../components/BackButton';

function Other() {
  return (
    <div style={{ marginLeft: '220px', padding: '20px', position: 'relative' }}>
      <BackButton />
      <div style={{ marginTop: '60px' }}>
        <div>
          <h2>其他信息</h2>
          <p>以下是关于极光计算机平台项目的其他重要信息，包括项目所有权、联系方式、隶属单位和地址等内容。</p>

          <h3>项目所有权</h3>
          <p>极光计算机平台由极光科技有限公司独家研发和所有。所有与本平台相关的知识产权，包括但不限于软件代码、算法、文档等，均归极光科技有限公司所有。未经书面许可，任何个人或组织不得复制、修改、传播或用于商业用途。</p>

          <h3>联系方式</h3>
          <p>如有任何问题、建议或合作意向，欢迎通过以下方式联系我们：</p>
          <ul>
            <li>客服热线：400-123-4567</li>
            <li>电子邮箱：support@auroratech.com</li>
            <li>官方网站：<a href="https://www.auroratech.com" target="_blank" rel="noopener noreferrer">www.auroratech.com</a></li>
          </ul>

          <h3>隶属单位</h3>
          <p>极光计算机平台隶属于极光科技有限公司。极光科技有限公司是一家致力于前沿科技研发的高新技术企业，专注于人工智能、大数据和云计算等领域的创新与应用。</p>

          <h3>公司地址</h3>
          <p>我们的总部地址是：</p>
          <address>
            极光科技有限公司<br />
            北京市海淀区中关村软件园一期 3 号楼 10 层<br />
            邮政编码：100190<br />
            中国
          </address>

          <h3>社交媒体</h3>
          <p>关注我们的社交媒体，获取最新的产品动态和行业资讯：</p>
          <ul>
            <li>微信公众号：极光科技</li>
            <li>微博：<a href="https://weibo.com/auroratech" target="_blank" rel="noopener noreferrer">@极光科技</a></li>
            <li>LinkedIn：<a href="https://www.linkedin.com/company/auroratech" target="_blank" rel="noopener noreferrer">Aurora Tech</a></li>
          </ul>

          <h3>法律声明</h3>
          <p>本平台上的所有内容仅供参考，极光科技有限公司不对因使用本平台而产生的任何直接或间接损失负责。用户在使用本平台时，需遵守相关法律法规，并自行承担相应风险。</p>
        </div>
      </div>
    </div>
  );
}

export default Other;
