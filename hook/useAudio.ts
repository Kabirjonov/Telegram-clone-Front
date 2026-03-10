import useSound from "use-sound";

export default function useAudio() {
	const [play2] = useSound("/audio/2.mp3");
	const [play3] = useSound("/audio/3.mp3");
	const [play4] = useSound("/audio/4.mp3");
	const [play5] = useSound("/audio/5.mp3");

	const playSound = (value: string) => {
		switch (value) {
			case "2.mp3":
				play2();
				break;
			case "3.mp3":
				play3();
				break;
			case "4.mp3":
				play4();
				break;
			case "5.mp3":
				play5();
				break;
		}
	};
	return { playSound };
}
