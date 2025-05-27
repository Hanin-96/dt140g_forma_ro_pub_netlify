import { useEffect, useState } from 'react'
import { Question } from '../../types/DoshaQuiz'
import quizStyle from './DoshaQuizStyle.module.css';
import { ChevronLeft, ChevronRight, Flame, RotateCcw, Sprout, Wind } from 'lucide-react';
import LoadingSpinnerStyle from '../LoadingSpinner/LoadingSpinnerStyle.module.css';

function DoshaQuiz() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [error, setError] = useState("");
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
    const [userAnswers, setUserAnswers] = useState<{ [questionId: number]: string }>({});

    const [showResult, setShowResult] = useState(false);
    const [loadingSpinner, setLoadingSpinner] = useState(false);


    const [hasStartedQuiz, setHasStartedQuiz] = useState(false);


    const [vataCount, setVataCount] = useState(0);
    const [pittaCount, setPittaCount] = useState(0);
    const [kaphaCount, setKaphaCount] = useState(0);


    const getQuizData = async () => {
        setLoadingSpinner(true);

        try {
            const response = await fetch("http://localhost:8002/wp-json/wp/v2/dosha_quiz?_fields=title,dosha_answers,id", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);

                if (data.length > 0) {
                    setQuestions(data);
                    sessionStorage.setItem("doshaQuizData", JSON.stringify(data));
                    setLoadingSpinner(false);

                }
            }

        } catch (error) {
            setError("Ingen quiz information är tillgänglig")
        } finally {
            setLoadingSpinner(false);
        }
    }

    //Hämta quizdata via getQuizData
    useEffect(() => {
        const cachedDoshaQuizData = sessionStorage.getItem("doshaQuizData");
        if (cachedDoshaQuizData) {
            setQuestions(JSON.parse(cachedDoshaQuizData));
            return;
        }
        getQuizData();
    }, []);

    if (questions.length === 0 && loadingSpinner) return <div className={LoadingSpinnerStyle.loadingSpinner}></div>;

    //Hantera användares svar
    const handleUserAnswer = (doshaKey: string, index: number, questionId: number) => {
        setSelectedAnswerIndex(index);
        //lagrar användares svar till specifika frågor
        setUserAnswers((answers) => ({ ...answers, [questionId]: doshaKey }));
    }

    //Hantera klicka på nästa
    const onClickNext = () => {
        setSelectedAnswerIndex(null);
        if (activeQuestionIndex < questions.length - 1) {
            setActiveQuestionIndex(activeQuestionIndex + 1);
        } else {

            //Gör om objekt till lista
            Object.values(userAnswers).forEach((dosha) => {
                switch (dosha) {
                    case 'vata':
                        setVataCount((prev) => prev + 1);
                        break;
                    case 'pitta':
                        setPittaCount((prev) => prev + 1);
                        break;
                    case 'kapha':
                        setKaphaCount((prev) => prev + 1);
                        break;
                    default:
                        console.log("Dosha existerar inte: ", dosha)
                }
            });

            setShowResult(true);
        }

    }

    const getDoshaResult = () => {
        const result = [
            { dosha: 'Vata', score: vataCount },
            { dosha: 'Pitta', score: pittaCount },
            { dosha: 'Kapha', score: kaphaCount }
        ];

        const sorted = [...result].sort((a, b) => b.score - a.score);
        const topDosha = sorted[0].dosha;

        return topDosha;
    }

    const handlePrevious = () => {
        setActiveQuestionIndex((prev) => prev - 1);
        const prevQuestionId = questions[activeQuestionIndex - 1].id;
        const prevDosha = userAnswers[prevQuestionId];
        const index = Object.keys(questions[activeQuestionIndex - 1].dosha_answers).indexOf(prevDosha);
        setSelectedAnswerIndex(index !== -1 ? index : null);
    };

    //Rensar(nollställer) quizet
    const resetQuiz = () => {
        setActiveQuestionIndex(0);
        setSelectedAnswerIndex(null);
        setUserAnswers({});
        setShowResult(false);
        setVataCount(0);
        setPittaCount(0);
        setKaphaCount(0);

    };

    const questionNumber = (num: number) => {
        return num < 10 ? "0" + num : num;
    };

    const endQuiz = () => {
        resetQuiz();
        setHasStartedQuiz(false);
    }

    return (
        <>
            <div className='max-w-3xl w-full'>
                {!hasStartedQuiz ? (
                    <div className='bg-forma_ro_blue w-full max-w-3xl p-4 text-white rounded-2xl'>
                        <h1 className='text-center mb-10'>Dosha Quiz</h1>
                        <p className='text-white mt-4 text-center'>Varje fråga har tre alternativ – ett för varje dosha.
                            Starta quiz nedan för att ta reda vilken dosha-typ som är mest framträdande hos dig.
                        </p>
                        <p className='text-white mt-4 text-center'>Inga svar lagras, du är därmed helt anonym när du genomför testet.</p>
                        <p className='text-white mt-4 text-center'>Observera att quizet inte är att betrakta som medicinsk rådgivning, utan ska ses som en väg till självreflektion och inspiration.</p>
                        <button onClick={() => setHasStartedQuiz(true)} className='w-full p-4 text-[18px] bg-forma_ro_orange rounded-2xl mt-20 text-forma_ro_black relative'>
                            Starta Quiz <ChevronRight className='inline absolute right-0' />
                        </button>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </div>
                ) : questions.length === 0 ? (
                    <p className='p-4'>Inga frågor tillgängliga.</p>
                ) : (
                    <div className={`${quizStyle.quizContainer} relative w-full max-w-3xl box-border`}>

                        {!showResult ? (
                            <div className='w-full max-w-3xl p-4'>
                                <div className='absolute top-0 right-0 text-forma_ro_black p-4 text-[16px] bg-white m-4 rounded-full'>
                                    <span className="text-[20px] font-bold">
                                        {questionNumber(activeQuestionIndex + 1)}
                                    </span>
                                    <span className="total-question">
                                        /{questionNumber(questions.length)}
                                    </span>
                                </div>
                                <h2 className='text-white text-[32px] max-w-[35rem] w-full'>{questions[activeQuestionIndex].title.rendered}</h2>
                                <ul className='mt-20'>
                                    {Object.entries(questions[activeQuestionIndex].dosha_answers).map(
                                        ([doshaKey, answerText], index) => (
                                            <li
                                                key={doshaKey}
                                                onClick={() =>
                                                    handleUserAnswer(
                                                        doshaKey,
                                                        index,
                                                        questions[activeQuestionIndex].id
                                                    )
                                                }
                                                className={
                                                    selectedAnswerIndex === index
                                                        ? quizStyle.selectedAnswer
                                                        : undefined
                                                }
                                            >
                                                {answerText}
                                            </li>
                                        )
                                    )}
                                </ul>
                                <div className='flex justify-between gap-8'>
                                    {activeQuestionIndex > 0 && (
                                        <button className='w-full p-4 text-[18px] bg-forma_ro_blue border-[1px] text-white rounded-2xl relative' onClick={handlePrevious}>
                                            <ChevronLeft className='inline stroke-white absolute left-0' />
                                            Tillbaka
                                        </button>
                                    )}
                                    <button onClick={onClickNext} disabled={selectedAnswerIndex === null} className='w-full p-4 text-[18px] bg-forma_ro_orange rounded-2xl relative'>
                                        {activeQuestionIndex === questions.length - 1
                                            ? "Visa Resultat"
                                            : (<span >Nästa <ChevronRight className=' inline absolute right-0' /></span>)}
                                    </button>
                                </div>
                                <div>
                                    <button onClick={endQuiz} className='w-full p-4 text-[18px] bg-forma_ro_blue border-[1px] text-white rounded-2xl relative mt-12'>
                                        Avsluta quiz
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center max-w-3xl w-full p-4">
                                <h3 className='text-white mb-10'>Din dosha typ: {getDoshaResult()}</h3>

                                <div className={quizStyle.result}>
                                    <h4 className='text-white text-[20px]'>Poäng per dosha:</h4>
                                    <p className='flex justify-center gap-4'>Vata: {vataCount} <Wind className='stroke-white' /></p>
                                    <p className='flex justify-center gap-4'>Pitta: {pittaCount} <Flame className='stroke-white' /></p>
                                    <p className='flex justify-center gap-4'>Kapha: {kaphaCount} <Sprout className='stroke-white' /></p>
                                </div>
                                <button onClick={resetQuiz} className='w-full p-4 text-[18px] bg-forma_ro_orange rounded-2xl relative text-forma_ro_black mt-10'>Gör om testet <RotateCcw className='inline ml-2' /></button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    )
}

export default DoshaQuiz