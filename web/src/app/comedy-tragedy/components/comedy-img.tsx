import Image from 'next/image';

import { motion } from 'motion/react';

import img from 'images/comedy.webp';

export const ComedyImg = () => {
  return (
    <motion.div
      className="will-change-transform"
      animate={{ y: [0, -8, 0, 8, 0] }}
      transition={{ duration: 8, ease: 'easeInOut', repeat: Infinity }}
    >
      <Image src={img} alt={'Comedy'} width={320} height={570} priority />
    </motion.div>
  );
};
