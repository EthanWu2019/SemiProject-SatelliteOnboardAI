import React from 'react';
import BackButton from '../components/BackButton';

function ProductIntro() {
  return (
    <div style={{ marginLeft: '220px', padding: '20px', position: 'relative' }}>
      <BackButton />
      <div style={{ marginTop: '60px' }}>
        <h2>产品介绍</h2>
        
        {/* 极光1000智能计算机 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '40px' }}>
          <img src="/images/jiguang1000.jpg" alt="极光1000智能计算机" style={{ width: '400px', height: '300px', objectFit: 'cover', marginRight: '20px' }} />
          <div style={{ flex: '1' }}>
            <h3>极光1000智能计算机</h3>
            <p><strong>硬件架构：</strong> 极光1000智能计算机采用FPGA+CPU+寒武纪专用加速芯片，全自主可控设计。这种架构不仅提升了计算性能，还确保了系统的安全性和可控性。</p>
            <p><strong>对外接口：</strong> 配备千兆以太网、GTX/2711高速接口和CAN总线，提供多种连接方式，满足不同应用场景的需求。</p>
            <p><strong>固存容量：</strong> 内置1TB SSD存储，支持大规模数据的高速存取，适用于数据密集型应用。</p>
            <p><strong>总线扩展：</strong> 采用PCIe2.0标准，提供更高的带宽和扩展性，满足未来升级需求。</p>
            <p><strong>操作系统支持：</strong> 兼容银河麒麟和Ubuntu操作系统，确保软件的广泛适用性和灵活性。</p>
            <p><strong>深度学习框架：</strong> 支持Pytorch深度学习框架，适用于人工智能和机器学习任务。</p>
            <p><strong>外形尺寸：</strong> 200x150x33mm，小巧紧凑，易于集成到各种设备和系统中。</p>
            <p><strong>重量：</strong> 1300±50g，重量适中，便于携带和安装。</p>
            <p><strong>功耗：</strong> 常规功耗36W，峰值功耗50W，能效比高，适合长时间运行。</p>
            <p><strong>算力：</strong> 提供32TOPS的计算性能，能够处理复杂的计算任务，适用于高性能计算应用。</p>
            <p>极光1000智能计算机凭借其高性能的硬件架构、灵活的扩展能力和广泛的应用支持，成为各类科研、工业和商业计算需求的理想选择。无论是在数据中心还是边缘计算场景中，极光1000都能提供卓越的计算能力和可靠性，帮助用户应对最严苛的计算挑战。</p>
          </div>
        </div>

        {/* MLU220智能计算单元 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '40px' }}>
          <img src="/images/mlu220.jpg" alt="极光2000智能计算机" style={{ width: '400px', height: '300px', objectFit: 'cover', marginRight: '20px' }} />
          <div style={{ flex: '1' }}>
            <h3>极光2000智能计算机</h3>
            <p><strong>算力单元：</strong> 极光2000整机包含10个MLU220算力单元。MLU220是一款专门用于深度学习的SOC芯片，内部集成寒武纪1M架构AI处理器核心，内置4核ARM Cortex-A55和硬件视频编解码单元。它具有高效的推理和低功耗优势，适用于智能视觉分析、智慧监控、机器人、无人机和边缘计算等领域。</p>
            <p><strong>算力：</strong> 80TOPS（int8）。</p>
            <p><strong>软件SDK支持：</strong> 用于边缘计算的专用SDK、用于推理任务的多种算子库、高性能视频编解码库、高性能图像解码库。</p>
            <p><strong>国产化：</strong> 采用国产化芯片比例高达90%。国产CPU：飞腾FT2000-4，国产NPU：寒武纪MLU220，国产FPGA：复旦微JFM7VX690T20。</p>
            <p><strong>功耗：</strong> 300W。</p>
            <p><strong>尺寸：</strong> VPX 3U架构，9槽位。本体尺寸：246.6×258.0×140.0 ±1.0mm，包装尺寸：280.6×284.6×140.0 ±1.0mm。</p>
            <p><strong>重量：</strong> 10kg。</p>
            <p><strong>供电：</strong> DC：28V-32V。</p>
            <p><strong>接口：</strong> 光纤X4输入（Rapid IO），光纤X4输出（Rapid IO），千兆以太网，CAN总线。</p>
            <p><strong>支持AI框架：</strong> 支持PyTorch、TensorFlow等主流AI框架。</p>
            <p><strong>操作系统：</strong> 分布式LINUX。</p>
            <p><strong>在轨更新方式：</strong> 支持软件app注入模型上注。</p>
            <p>MLU220智能计算单元在极光1000智能计算机中的应用，充分展示了其在高效推理和低功耗方面的优势。无论是用于智能视觉分析还是边缘计算场景，MLU220都能提供卓越的性能和可靠性。</p>
          </div>
        </div>

        {/* 极光5000智能计算机 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '40px' }}>
          <img src="/images/jiguang5000.jpg" alt="极光5000智能计算机" style={{ width: '400px', height: '300px', objectFit: 'cover', marginRight: '20px' }} />
          <div style={{ flex: '1' }}>
            <h3>极光5000智能计算机</h3>
            <p><strong>多备份高可用：</strong> 极光5000智能计算机具有多备份高可用特性，确保系统在各种情况下的稳定运行。</p>
            <p><strong>智能算力：</strong> 提供350 TOPS的智能算力，能够处理复杂的计算任务，适用于高性能计算应用。</p>
            <p><strong>存储能力：</strong> 提供40T Bits的存储能力，支持大规模数据的存储和高速访问。</p>
            <p><strong>重量：</strong> 80kg，坚固耐用，适合各种工业和科研环境。</p>
            <p><strong>功耗：</strong> 1000W，适合高性能计算和数据密集型应用。</p>
            <p>极光5000智能计算机凭借其卓越的算力和高可用性，成为各类高性能计算和数据处理需求的理想选择。无论是在科研、工业还是商业计算环境中，极光5000都能提供强大的计算能力和可靠性，帮助用户应对最严苛的计算挑战。</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProductIntro;
